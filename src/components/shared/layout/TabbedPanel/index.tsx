import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import {
  AllowedEntityRole,
  AuthorizationStates,
  RequireAuthComponent,
  validateUserAuthorization,
} from '~/components/shared/atoms/app/auth/RequiredAuth';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import {
  ComponentDescriptor,
  ContentSection,
  PageSection,
} from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  buildComponent as buildComponentFromRegistry,
  registerAllBuilders,
} from '~/components/shared/organisms/gui/builders/componentBuilders';
import './index.scss';

export interface TabbedPage {
  _name?: string; // Internal name (not translated)
  name: string;
  tabContent: any;
  requireSession?: boolean;
  allowedRoles?: AllowedEntityRole[];
  hideMainMenu?: boolean;
}

export interface DefaultTransformerContext {
  entityData?: any;
  handlers?: any;
  translationBasePath?: string;
  translateText: (key: string) => string;
  buildComponent?: (
    subpage: PageSection,
    section: ContentSection,
    componentDescriptor: ComponentDescriptor,
    componentIndex: number,
    parentDataSource?: any
  ) => JSX.Element;
}

export interface TabbedPanelProps<TConfig = any> {
  tabs?: TabbedPage[];
  rawConfig?: TConfig;
  configTransformer?: (config: TConfig, context?: DefaultTransformerContext) => TabbedPage[];
  defaultTransformerContext?: DefaultTransformerContext;
  allowedSections?: any;
  handlers?: { [key: string]: Function };
  showSpecificTab?: number;
}

// Flag para registrar builders solo una vez
let buildersRegistered = false;

// Registrar builders al cargar el módulo
if (!buildersRegistered) {
  registerAllBuilders();
  buildersRegistered = true;
}

// Default transformer function (moved from ProfileTabsPage)
const defaultConfigTransformer = (subpagesConfig: PageSection[], context?: DefaultTransformerContext): TabbedPage[] => {
  if (!context) return [];

  const { translateText, translationBasePath, entityData, handlers } = context;

  // Si no se proporciona buildComponent, usar el builder por defecto
  let buildComponent = context.buildComponent;
  if (!buildComponent) {
    buildComponent = (
      subpage: PageSection,
      section: ContentSection,
      componentDescriptor: ComponentDescriptor,
      componentIndex: number,
      parentDataSource?: any
    ) => {
      return buildComponentFromRegistry({
        componentDescriptor,
        subpage,
        section,
        componentIndex,
        entityData,
        parentDataSource,
        handlers: handlers || {},
        translationBasePath: translationBasePath || '',
      });
    };
  }

  const translateSubpage = (subpage: string) => {
    return translateText(`${translationBasePath}.subpages.${subpage}.name`);
  };

  const translateSection = (subpage: string, section: string) => {
    return section ? translateText(`${translationBasePath}.subpages.${subpage}.sections.${section}.name`) : undefined;
  };

  return (subpagesConfig || []).map((subpage, subPageIndex) => {
    return {
      _name: subpage.name,
      name: translateSubpage(subpage.name),
      hideMainMenu: subpage.hideMainMenu,
      allowedRoles: subpage.allowedRoles,
      requireSession: subpage.requireSession,
      tabContent: () => {
        return (
          <RequireAuthComponent
            requiredSession={subpage.requireSession}
            key={`section_${subPageIndex}_${subpage.name}`}
          >
            {(subpage.sections || [])
              .filter(
                (section) =>
                  section.hidden === undefined ||
                  (typeof section.hidden === 'boolean' && !section.hidden) ||
                  (typeof section.hidden === 'string' && section.hidden !== 'true') ||
                  (section.hidden instanceof Function && entityData && !section.hidden(entityData))
              )
              .map((section, sectionIndex) => {
                let contentComponents: any = <></>;
                if (section.components && buildComponent) {
                  contentComponents = (section.components || []).map(
                    (componentDescriptor: ComponentDescriptor, componentIndex: number) => (
                      <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
                        {buildComponent(subpage, section, componentDescriptor, componentIndex, undefined)}
                      </div>
                    )
                  );
                }

                const sectionContent = () => contentComponents;

                const filteredSections = (subpage.sections || []).filter((section) => {
                  const isHidden =
                    section.hidden !== undefined &&
                    ((typeof section.hidden === 'boolean' && section.hidden) ||
                      (typeof section.hidden === 'string' && section.hidden === 'true') ||
                      (section.hidden instanceof Function && entityData && section.hidden(entityData)));

                  if (isHidden) return false;

                  if (section.requireSession && !entityData) {
                    return false;
                  }

                  return true;
                });

                return (
                  <RequireAuthComponent
                    key={`section-${section.name}-${sectionIndex}`}
                    requiredSession={section.requireSession}
                  >
                    <SectionsPanel
                      sectionName={section?.emptyTitle ? '' : translateSection(subpage.name, section?.name)}
                      sectionContent={sectionContent}
                      isCollapsible={filteredSections.length > 1}
                    />
                  </RequireAuthComponent>
                );
              })}
          </RequireAuthComponent>
        );
      },
    };
  });
};

export const TabbedPanel = <TConfig = any,>(props: TabbedPanelProps<TConfig>) => {
  const {
    tabs: providedTabs,
    rawConfig,
    configTransformer,
    defaultTransformerContext,
    allowedSections,
    handlers = {},
    showSpecificTab,
  } = props;

  // Si se proporciona rawConfig, usar el transformer personalizado o el default
  let tabs: TabbedPage[];
  if (rawConfig) {
    if (configTransformer) {
      // Usar transformer personalizado
      tabs = configTransformer(rawConfig, defaultTransformerContext);
    } else if (defaultTransformerContext) {
      // Usar transformer por defecto
      tabs = defaultConfigTransformer(rawConfig as unknown as PageSection[], defaultTransformerContext);
    } else {
      tabs = [];
    }
  } else {
    // Usar tabs directamente si se proporcionaron
    tabs = providedTabs || [];
  }

  const currentUser = useSelector(selectCurrentUser);

  const [activeSectionIndex, setSection] = useState(0);

  useEffect(() => {
    changeSection(0);
  }, []);

  useEffect(() => {
    handlers?.['onSelectedTab']?.(activeSectionIndex);
  }, [activeSectionIndex]);

  const changeSection = (activeSection: number) => {
    window.scroll(0, 0);
    setSection(activeSection);
  };

  useEffect(() => {
    if (showSpecificTab != undefined) {
      changeSection(showSpecificTab);
    }
  }, [showSpecificTab]);

  const handlePrev = (source?: any) => {
    let nextSection = activeSectionIndex - 1;
    let authState = AuthorizationStates.UNAUTHORIZED_AND_LOGGED_USER;

    // Recorre hacia atrás hasta que se encuentre una sección permitida o se llegue al principio
    while (nextSection >= 0) {
      const subpage = tabs[nextSection];
      authState = validateUserAuthorization(currentUser, subpage.allowedRoles, subpage.requireSession);

      if (AuthorizationStates.ALLOWED === authState) {
        break; // Sal del loop si se encuentra una sección permitida
      }

      nextSection--; // Decrementa nextSection para seguir buscando hacia atrás
    }

    // Solo cambia de sección si se encontró una que esté permitida
    if (nextSection >= 0 && AuthorizationStates.ALLOWED === authState) {
      changeSection(nextSection);
    }
  };

  const handleNext = (source?: any) => {
    let nextSection = activeSectionIndex + 1;
    let authState = AuthorizationStates.UNAUTHORIZED_AND_LOGGED_USER;

    // Recorre hacia adelante hasta que se encuentre una sección permitida o se llegue al final
    while (nextSection < tabs?.length) {
      const subpage = tabs[nextSection];
      authState = validateUserAuthorization(currentUser, subpage.allowedRoles, subpage.requireSession);

      if (AuthorizationStates.ALLOWED === authState) {
        break; // Sal del loop si se encuentra una sección permitida
      }

      nextSection++; // Aumenta nextSection para seguir buscando hacia adelante
    }

    // Solo cambia de sección si se encontró una que esté permitida
    if (nextSection < tabs?.length && AuthorizationStates.ALLOWED === authState) {
      changeSection(nextSection);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable swipe with mouse for testing on desktop
    delta: (5 * window.screen.width) / 11,
  });

  const tabTitles = () => {
    const filteredTabsWithOriginalIndex: { subpage: TabbedPage; originalIndex: number }[] = tabs
      .map((subpage: TabbedPage, originalIndex: number) => ({ subpage, originalIndex }))
      .filter(
        ({ subpage }: { subpage: TabbedPage; originalIndex: number }) =>
          validateUserAuthorization(currentUser, subpage.allowedRoles, subpage.requireSession) ===
            AuthorizationStates.ALLOWED && !subpage.hideMainMenu
      );

    return filteredTabsWithOriginalIndex.map(
      ({ subpage, originalIndex }: { subpage: TabbedPage; originalIndex: number }, filteredIndex: number) => {
        const classNames = ['subpage-tab'];
        if (activeSectionIndex === originalIndex) {
          classNames.push('active-tab-title');
        }
        return (
          <RequireAuthComponent
            key={`subpage-section-${originalIndex}`}
            allowedRoles={subpage.allowedRoles}
            requiredSession={subpage.requireSession}
          >
            <div className={classNames.join(' ')} onClick={() => changeSection(originalIndex)}>
              <h5>{subpage.name}</h5>
            </div>
          </RequireAuthComponent>
        );
      }
    );
  };

  const tabContents = () => {
    const subpage = tabs[activeSectionIndex]?.tabContent;

    return subpage && <div className="full-content">{subpage()}</div>;
  };

  const titles = tabTitles();

  return (
    <div {...swipeHandlers}>
      {titles.length > 1 && !tabs[activeSectionIndex]?.hideMainMenu && <div className="subpages-tabs">{titles}</div>}
      <div>{tabContents()}</div>
    </div>
  );
};
