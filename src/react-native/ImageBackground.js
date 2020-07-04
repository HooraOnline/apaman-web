import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
import images from "../../public/static/assets/images";

export default function ImageBackground(props) {
    let {style={},source} = props;
    const styles = {
        main: {
            "background-image":`url(${props.source})`,
            "background-repeat": 'no-repeat',
            "background-size": '100% 100%',

        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View  src={source} {...props}  className={classes.main}/>
    );
}





