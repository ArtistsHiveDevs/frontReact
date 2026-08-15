import { useEffect, useRef, useState } from 'react';
import { Avatar, IconButton, ListItemAvatar, ListItemText, Menu, MenuItem } from '@mui/material';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import './ParticipantSelectorHeader.scss';

const AVATAR_SIZE = '2.5rem';

interface ParticipantSelectorHeaderProps {
  participants: CurrentProfileInfoModel[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const ParticipantSelectorHeader = ({ participants, activeIndex, onSelect }: ParticipantSelectorHeaderProps) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [hiddenIndices, setHiddenIndices] = useState<Set<number>>(new Set());

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    itemRefs.current
      .get(activeIndex)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [activeIndex]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setHiddenIndices((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (entry.isIntersecting) next.delete(idx);
            else next.add(idx);
          });
          return next;
        });
      },
      { root: container, threshold: 1.0 }
    );

    itemRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [participants]);

  const hasOverflow = hiddenIndices.size > 0;

  return (
    <div className="psh__wrapper">
      <div className="psh__list" ref={listRef}>
        {participants.map((participant, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) itemRefs.current.set(i, el);
              else itemRefs.current.delete(i);
            }}
            data-index={i}
            className={`psh__item${activeIndex === i ? ' psh__item--active' : ''}`}
            onClick={() => onSelect(i)}
          >
            <Avatar
              src={participant.profile_pic}
              alt={participant.name}
              sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE, flexShrink: 0 }}
            />
            <div className="psh__info">
              <div className="psh__name">{participant.name}</div>
              <div className="psh__username">@{participant.username}</div>
            </div>
          </div>
        ))}
      </div>

      {hasOverflow && (
        <div className="psh__overflow-btn">
          <IconButton size="small" onClick={(e: any) => setMenuAnchor(e.currentTarget)}>
            <DynamicIcons
              iconName={Boolean(menuAnchor) ? 'fa FaChevronDown' : 'bs BsThreeDots'}
              color={'white'}
              size={20}
            />
          </IconButton>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            {participants
              .filter((_, i) => hiddenIndices.has(i))
              .map((participant, _, arr) => {
                const i = participants.indexOf(participant);
                return (
                  <MenuItem
                    key={i}
                    selected={activeIndex === i}
                    onClick={() => {
                      onSelect(i);
                      setMenuAnchor(null);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={participant.profile_pic} alt={participant.name} />
                    </ListItemAvatar>
                    <ListItemText primary={participant.name} secondary={`@${participant.username}`} />
                  </MenuItem>
                );
              })}
          </Menu>
        </div>
      )}
    </div>
  );
};
