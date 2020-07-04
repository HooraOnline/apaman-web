import View from "./View";
export default function IconApp(props) {
    let style=props.style ||{};
    style.fontSize=style.fontSize || style.width || style.height;
    style.color=style.color || style.tintColor;
    return (
        <View  {...props} style={style} className={props.name ||props.source } />
    );
}





