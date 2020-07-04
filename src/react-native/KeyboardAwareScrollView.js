
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function KeyboardAvoidingView(props) {
    let {style={},onPress,disabled} = props;
    const styles = {
        main: {

        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props} style={style} className={classes.main}/>
    );
}




