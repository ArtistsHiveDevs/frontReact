import { useI18n } from "~/common/utils";
import {
  ARTISTS_HIVE_SOCIAL_NETWORKS,
  SocialNetworks,
  buildSocialNetworkLinkData,
} from "~/constants/social-networks.const";
import { DynamicIcons } from "../../DynamicIcons";
import "./FooterSocialNetworks.scss";

const FooterSocialNetworks = (props: any) => {
  const { translateText } = useI18n();
  return (
    <>
      <div className="ah-social-networks">
        <h3>{translateText(`app.global_dictionary.actions.follow_us`)}</h3>

        <div className="ah-social-networks-container">
          {Object.keys(ARTISTS_HIVE_SOCIAL_NETWORKS).map((socialNetwork) => {
            const network = SocialNetworks[socialNetwork];

            if (network) {
              const networkUser =
                ARTISTS_HIVE_SOCIAL_NETWORKS[
                  socialNetwork as keyof typeof ARTISTS_HIVE_SOCIAL_NETWORKS
                ];

              const urlSocialNetwork = buildSocialNetworkLinkData(
                socialNetwork,
                networkUser
              );

              return (
                <a
                  href={urlSocialNetwork.url}
                  target={urlSocialNetwork.target}
                  key={`AH-${socialNetwork}`}
                >
                  <div title={networkUser}>
                    <DynamicIcons iconName={network.icon} size={25} />
                  </div>
                </a>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      </div>
    </>
  );
};

export default FooterSocialNetworks;
