import {textDisabled} from "../constants/colors";
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function TouchableOpacity(props) {
    let {style={},onPress,disabled} = props;
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props} style={style} className={classes.main}    onClick={disabled?null:onPress}/>
    );
}

const styles = {
    main: {
        cursor:'pointer',
    },
}

