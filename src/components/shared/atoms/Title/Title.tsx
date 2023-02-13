import "./Title.scss";

export const Title = (props: {
  title: string;
  size: "1" | "2" | "3" | "4" | "5";
}) => {
  const { title, size } = props;
  switch (size) {
    case "1":
      return <h1>{title}</h1>;
    case "2":
      return <h2>{title}</h2>;
    case "3":
      return <h3>{title}</h3>;
    case "4":
      return <h4>{title}</h4>;
    case "5":
      return <h5>{title}</h5>;
    default:
      return <></>;
  }
};
