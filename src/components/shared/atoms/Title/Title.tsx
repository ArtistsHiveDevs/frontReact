import './Title.scss';

export const Title = (props: { title: string; size: '1' | '2' | '3' | '4' | '5'; onClickHandler: Function }) => {
  const { title, size, onClickHandler } = props;

  function onClick(source: any) {
    if (!!onClickHandler) {
      onClickHandler(source);
    }
  }

  switch (size) {
    case '1':
      return <h1 onClick={() => onClick(title)}>{title}</h1>;
    case '2':
      return <h2 onClick={() => onClick(title)}>{title}</h2>;
    case '3':
      return <h3 onClick={() => onClick(title)}>{title}</h3>;
    case '4':
      return <h4 onClick={() => onClick(title)}>{title}</h4>;
    case '5':
      return <h5 onClick={() => onClick(title)}>{title}</h5>;
    default:
      return <p onClick={() => onClick(title)}>{title}</p>;
  }
};
