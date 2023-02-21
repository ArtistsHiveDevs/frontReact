import { EntityModel, EntityTemplate } from "~/models/base";
import "../home/cultural-agenda-page.scss";

type InputParamsTemplate = {
  title?: string;
  listElements?: EntityModel<EntityTemplate>[];
};

const FeaturedSection: React.FC<InputParamsTemplate> = (
  props: InputParamsTemplate
) => {
  return <div>{props.title}</div>;
};

export default FeaturedSection;
