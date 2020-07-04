import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
const Progress={
    Bar:(props)=><LinearProgress {...props}  color="secondary" ></LinearProgress>,
    Progress:(props)=><CircularProgress  {...props}  color="secondary" ></CircularProgress>,

}
export default Progress;
