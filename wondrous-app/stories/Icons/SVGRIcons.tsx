import * as icons from './SVGRIconsList';

const SVGRIcons = (props) => {
  return Object.keys(icons).map((key) => {
    const Icon = icons[key];

    return (
      <div key={key} style={{ display: 'flex', color: 'white', flexDirection: 'row', margin: '10px 0' }}>
        <div key={key} style={{ flex: '0 0 100px', textAlign: 'center' }}>
          <Icon {...props} />
        </div>
        <div>{key}</div>
      </div>
    );
  });
};

export default SVGRIcons as any;
