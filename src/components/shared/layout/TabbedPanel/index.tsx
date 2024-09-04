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
}

export const TabbedPanel = (props: any) => {
  const { tabs, allowedSections } = props;

  const currentUser = useSelector(selectCurrentUser);

  const [activeSectionIndex, setSection] = useState(0);

  useEffect(() => {
    changeSection(0);
  }, []);

  const changeSection = (activeSection: number) => {
    window.scroll(0, 0);
    setSection(activeSection);
  };

  const handlePrev = () => {
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

  const handleNext = () => {
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
  });

  const tabTitles = () => {
    return tabs.map((subpage: TabbedPage, idx: number) => {
      const classNames = ['subpage-tab'];
      if (activeSectionIndex === idx) {
        classNames.push('active-tab-title');
      }
      return (
        <RequireAuthComponent
          key={`subpage-section-${idx}`}
          allowedRoles={subpage.allowedRoles}
          requiredSession={subpage.requireSession}
        >
          <div className={classNames.join(' ')} onClick={() => changeSection(idx)}>
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

  return (
    <div {...swipeHandlers}>
      <div className="subpages-tabs">{tabTitles()}</div>
      <div>{tabContents()}</div>
    </div>
  );
};
