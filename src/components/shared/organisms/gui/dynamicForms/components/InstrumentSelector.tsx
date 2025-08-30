import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ComponentGeneratorParams } from '../DynamicControl';

interface Instrument {
  id: string;
  uniqueId: string;
  name: string;
  popularity: number;
  image: string | null;
}

interface Category {
  name: string;
  instruments: Instrument[];
}

interface Family {
  name: string;
  icon: string;
  categories: { [key: string]: Category };
}

interface InstrumentData {
  instrumentFamilies: { [key: string]: Family };
}

interface InstrumentSelectorProps {
  value?: string;
  onChange?: (instrument: Instrument | null) => void;
  placeholder?: string;
  multiple?: boolean;
  maxSelections?: number;
}

export const createInstrumentSelector = (params: ComponentGeneratorParams) => {
  // export const InstrumentSelector: React.FC<InstrumentSelectorProps> = (
  let value: any;
  let onChange = (e: any) => {
      console.log(e, fieldData, fieldNamePrefix, `${fieldNamePrefix}${fieldName}`);
      const newInstrumentsList = [...selectedInstruments, e];
      setSelectedInstruments(newInstrumentsList);
      config.value = (newInstrumentsList || []).map((instrument: any) => instrument.uniqueId);

      register(`${fieldNamePrefix}${fieldName}`, config);
      setOpenDialogSelectInstrument(false);
    },
    placeholder = 'Search and select an instrument...',
    multiple = false,
    maxSelections = 5;

  // ) => {
  const theme = useTheme();
  const [instrumentData, setInstrumentData] = useState<InstrumentData | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFamilies, setExpandedFamilies] = useState<{ [key: string]: boolean }>({});
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  const [openDialogSelectInstrument, setOpenDialogSelectInstrument] = useState(false);

  const { register, formState } = useFormContext();
  const { fieldData } = params;
  let { config, fieldName, fieldNamePrefix } = fieldData || {};
  register(fieldData.fieldName, config?.value);

  // Load instrument data
  useEffect(() => {
    const loadInstruments = async () => {
      try {
        const response = await fetch('/instruments.json');
        const data = await response.json();
        setInstrumentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load instruments data:', error);
        setLoading(false);
      }
    };

    loadInstruments();
  }, []);

  // Initialize selected instrument from value prop
  useEffect(() => {
    if (value && instrumentData && !multiple) {
      const instrument = findInstrumentById(value as string);
      setSelectedInstrument(instrument);
    }
  }, [value, instrumentData, multiple]);

  const findInstrumentById = (id: string): Instrument | null => {
    if (!instrumentData) return null;

    for (const family of Object.values(instrumentData.instrumentFamilies)) {
      for (const category of Object.values(family.categories)) {
        const instrument = category.instruments.find((inst) => inst.id === id || inst.uniqueId === id);
        if (instrument) return instrument;
      }
    }
    return null;
  };

  const handleInstrumentSelect = (instrument: Instrument) => {
    if (multiple) {
      const isSelected = selectedInstruments.some((i) => i.id === instrument.id);
      let newSelection: Instrument[];

      if (isSelected) {
        newSelection = selectedInstruments.filter((i) => i.id !== instrument.id);
      } else {
        if (selectedInstruments.length >= maxSelections) return;
        newSelection = [...selectedInstruments, instrument];
      }

      setSelectedInstruments(newSelection);
      onChange?.(newSelection.length > 0 ? newSelection[newSelection.length - 1] : null);
    } else {
      const newSelection = selectedInstrument?.id === instrument.id ? null : instrument;
      setSelectedInstrument(newSelection);
      onChange?.(newSelection);
    }
  };

  const toggleFamilyExpansion = (familyKey: string) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [familyKey]: !prev[familyKey],
    }));
  };

  const toggleCategoryExpansion = (categoryKey: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getFilteredInstruments = () => {
    if (!instrumentData || !searchTerm.trim()) return null;

    const filtered: { [familyKey: string]: { [categoryKey: string]: Instrument[] } } = {};
    const searchLower = searchTerm.toLowerCase();

    Object.entries(instrumentData.instrumentFamilies).forEach(([familyKey, family]) => {
      Object.entries(family.categories).forEach(([categoryKey, category]) => {
        const matchingInstruments = category.instruments.filter((instrument) =>
          instrument.name.toLowerCase().includes(searchLower)
        );

        if (matchingInstruments.length > 0) {
          if (!filtered[familyKey]) filtered[familyKey] = {};
          filtered[familyKey][categoryKey] = matchingInstruments;
        }
      });
    });

    return filtered;
  };

  const isInstrumentSelected = (instrument: Instrument) => {
    if (multiple) {
      return selectedInstruments.some((i) => i.id === instrument.id);
    }
    return selectedInstrument?.id === instrument.id;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography>Loading instruments...</Typography>
      </Box>
    );
  }

  if (!instrumentData) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="error">Failed to load instruments data</Typography>
      </Box>
    );
  }

  const filteredData = getFilteredInstruments();

  return (
    <>
      Instrumentos: <DynamicIcons iconName="md MdAdd" onClick={() => setOpenDialogSelectInstrument(true)} />
      <ul>
        {selectedInstruments.map((instrument: any, index: number) => {
          return <li key={`instrument_${index}`}>{instrument.name}</li>;
        })}
      </ul>
      <Dialog
        id="zoomAlbumImg"
        open={openDialogSelectInstrument}
        onClose={() => setOpenDialogSelectInstrument(false)}
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Agrega un instrumento
          <IconButton onClick={() => setOpenDialogSelectInstrument(false)} className="close-icon">
            <DynamicIcons iconName="MdClose" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="zoom-dialog">
          <Box>
            {/* Search Bar */}
            {/* <TextField
              fullWidth
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DynamicIcons iconName="MdSearch" size={20} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch}>
                      <DynamicIcons iconName="MdClear" size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            /> */}

            {/* Selected Instruments Display (for multiple mode) */}
            {multiple && selectedInstruments.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Instruments ({selectedInstruments.length}/{maxSelections}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedInstruments.map((instrument) => (
                    <Chip
                      key={instrument.id}
                      label={instrument.name}
                      onDelete={() => handleInstrumentSelect(instrument)}
                      avatar={
                        instrument.image ? (
                          <Avatar src={instrument.image} sx={{ width: 24, height: 24 }} />
                        ) : (
                          <Avatar sx={{ width: 24, height: 24 }}>🎵</Avatar>
                        )
                      }
                      color="primary"
                      variant="filled"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Instrument Hierarchy */}
            <Box>
              {Object.entries(filteredData || instrumentData.instrumentFamilies).map(
                ([familyKey, family]: [string, Family]) => {
                  const isExpanded = expandedFamilies[familyKey];

                  return (
                    <Card key={familyKey} sx={{ mb: 2 }}>
                      <CardContent sx={{ pb: 1 }}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          onClick={() => toggleFamilyExpansion(familyKey)}
                          sx={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="h6" component="span">
                              {family.icon}
                            </Typography>
                            <Typography variant="h6">{family.name}</Typography>
                          </Box>
                          <IconButton size="small">
                            <DynamicIcons iconName={isExpanded ? 'MdExpandLess' : 'MdExpandMore'} size={20} />
                          </IconButton>
                        </Box>

                        <Collapse in={isExpanded}>
                          <Box mt={2}>
                            {Object.entries(filteredData?.[familyKey] || family.categories).map(
                              ([categoryKey, category]: [string, Category]) => {
                                const categoryExpanded = expandedCategories[`${familyKey}-${categoryKey}`];

                                return (
                                  <Box key={categoryKey} mb={2}>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="space-between"
                                      onClick={() => toggleCategoryExpansion(`${familyKey}-${categoryKey}`)}
                                      sx={{ cursor: 'pointer', userSelect: 'none', pl: 2, py: 1 }}
                                    >
                                      <Typography variant="subtitle1" color="textSecondary">
                                        {category.name}
                                      </Typography>
                                      <IconButton size="small">
                                        <DynamicIcons
                                          iconName={categoryExpanded ? 'MdExpandLess' : 'MdExpandMore'}
                                          size={20}
                                        />
                                      </IconButton>
                                    </Box>

                                    <Collapse in={categoryExpanded}>
                                      <Grid container spacing={1} sx={{ pl: 4, pt: 1 }}>
                                        {(category.instruments || [])
                                          .sort((a, b) => b.popularity - a.popularity)
                                          .map((instrument) => (
                                            <Grid item xs={12} sm={6} md={4} key={instrument.id}>
                                              <Card
                                                variant="outlined"
                                                onClick={() => handleInstrumentSelect(instrument)}
                                                sx={{
                                                  cursor: 'pointer',
                                                  transition: 'all 0.2s',
                                                  border: isInstrumentSelected(instrument)
                                                    ? `2px solid ${theme.palette.primary.main}`
                                                    : `1px solid ${theme.palette.divider}`,
                                                  '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: theme.shadows[4],
                                                  },
                                                }}
                                              >
                                                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                  <Box display="flex" alignItems="center" gap={1}>
                                                    {instrument.image ? (
                                                      <Avatar src={instrument.image} sx={{ width: 32, height: 32 }} />
                                                    ) : (
                                                      <Avatar sx={{ width: 32, height: 32 }}>🎵</Avatar>
                                                    )}
                                                    <Box flex={1} minWidth={0}>
                                                      <Typography
                                                        variant="body2"
                                                        fontWeight="medium"
                                                        noWrap
                                                        title={instrument.name}
                                                      >
                                                        {instrument.name}
                                                      </Typography>
                                                      <Typography variant="caption" color="textSecondary" noWrap>
                                                        Popularity: {instrument.popularity}
                                                      </Typography>
                                                    </Box>
                                                  </Box>
                                                </CardContent>
                                              </Card>
                                            </Grid>
                                          ))}
                                      </Grid>
                                    </Collapse>
                                  </Box>
                                );
                              }
                            )}
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  );
                }
              )}
            </Box>

            {/* No Results Message */}
            {filteredData && Object.keys(filteredData).length === 0 && (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">No instruments found matching "{searchTerm}"</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
