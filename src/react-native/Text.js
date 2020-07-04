import View from "./View";

export default function Text(props) {
    let {children} = props;
    return (
        <View dir={props.dir} {...props}/>
    );
}


