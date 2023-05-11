import DynamicIcons from "~/components/shared/DynamicIcons";
import {
  CrewMemberTemplate,
  CrewTeamTemplate,
} from "~/models/domain/rider/rider.model";
import "./CrewListView.scss";

export interface CrewListViewParams {
  crewList: CrewTeamTemplate;
}

export const CrewListView = (props: CrewListViewParams) => {
  const { crewList } = props;

  let dietaryRestrictionsIcon = {
    vegetarian: { icon: "FaCarrot", size: 28, color: "#ff7303" },
    vegan: { icon: "RiPlantFill", size: 28, color: "#009900" },
  };

  return (
    <>
      {Object.keys(crewList).map((roleName) => {
        const members: CrewMemberTemplate[] = crewList[roleName];
        return (
          <>
            <h3>{roleName}</h3>
            <ul>
              {members.map((member) => {
                let memberDietaryRestrictionsIcon = undefined;

                if (
                  member.dietary_restrictions &&
                  Object.keys(dietaryRestrictionsIcon).includes(
                    member.dietary_restrictions
                  )
                ) {
                  memberDietaryRestrictionsIcon =
                    dietaryRestrictionsIcon[
                      member.dietary_restrictions as keyof typeof dietaryRestrictionsIcon
                    ];
                }

                return (
                  <li>
                    <p>
                      <strong>
                        {member.artistic_name || member.name}
                        {member.artistic_name && <> ({member.name})</>}
                      </strong>
                    </p>
                    <p className="member-info">
                      {member.document_type} {member.document_number}
                    </p>
                    <p className="member-info">{member.role}</p>
                    {memberDietaryRestrictionsIcon && (
                      <p className="member-info">
                        <strong>Dietary restrictions: </strong>
                        <DynamicIcons
                          iconName={memberDietaryRestrictionsIcon.icon}
                          size={memberDietaryRestrictionsIcon.size}
                          color={memberDietaryRestrictionsIcon.color}
                        />
                      </p>
                    )}
                    {member.allergies && member.allergies.length && (
                      <p className="member-info">
                        <strong>Allergies: </strong>
                        {member.allergies.join(", ")}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        );
      })}
    </>
  );
};
