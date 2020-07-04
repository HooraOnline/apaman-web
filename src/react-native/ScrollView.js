
import View from "./View";
import {makeStyles} from "@material-ui/core/styles";

export default function ScrollView(props) {
    let {style={},onPress,disabled} = props;
    const styles = {
        main: {
            maxHeight:style.maxHeight || '100%',
            overflowY:props.horizontal?'hidden':'auto',
            overflowX:props.horizontal?'auto':'hidden',
        },
    }
    const useStyles = makeStyles(styles);
    const classes = useStyles();
    return (
        <View {...props} style={style} className={classes.main}>
            <div style={props.contentContainerStyle}>
                {props.children}
            </div>
        </View>
    );
}




