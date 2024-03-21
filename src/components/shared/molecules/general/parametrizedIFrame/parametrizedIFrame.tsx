import './parametrizedIFrame.scss';

type ParametrizedIFrameTemplate = {
  srcUrl: string;
  customStyles?: { [nameParam: string]: string };
  customWidth?: string;
  customHeight?: string;
  title?: string;
};

export const ParametrizedIFrame: React.FC<ParametrizedIFrameTemplate> = (props: ParametrizedIFrameTemplate) => {
  return (
    <iframe
      style={props?.customStyles}
      src={`${props.srcUrl}`}
      width={`${props?.customWidth || '100%'}`}
      height={`${props?.customHeight || '200px'}`}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title={props?.title}
    ></iframe>
  );
};
