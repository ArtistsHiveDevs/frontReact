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
import './index.scss';

export interface TabbedPage {
  name: string;
  tabContent: any;
  requireSession?: boolean;
  allowedRoles?: AllowedEntityRole[];
  hideMainMenu?: boolean;
}

export const TabbedPanel = (props: any) => {
  const { tabs, allowedSections, handlers = {}, showSpecificTab } = props;

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

    return filteredTabsWithOriginalIndex
      .map(({ subpage, originalIndex }: { subpage: TabbedPage; originalIndex: number }, filteredIndex: number) => {
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
      });
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
