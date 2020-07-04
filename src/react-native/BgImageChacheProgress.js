import View from "./View";
import {makeStyles} from "@material-ui/core/styles";
import ImageBackground from "./ImageBackground";
import {fetchFactory, logger} from "../utils";
import {globalState, persistStore, userStore} from "../stores";
import {PureComponent} from "react";
import fetch from "isomorphic-unfetch";
import {getImageBase64Query} from "../network/Queries";


export default class BgImageChacheProgress extends PureComponent{
    constructor(props) {
        super();
        this.state = {
            source: props.source,
        };

    }
     unicodeToChar(text) {
        if (text) {
            return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
        } else return 'مشکلی پیش آمده! با پشتیبانی تماس بگیرید.';
    }
    async downloadImage(imageName){

        await getImageBase64Query(imageName)
            .then(result => {
                this.setState({loadingImage: false, source: result});
            })
            .catch(e =>{
                this.setState({loadingImage: false});
            } );
    }
    setImag=()=>{
        let source=this.props.source;
        if(!source){
            this.setState({source:undefined});
            return;
        }
        if(this.props.source==this.state.source){

           // return;
        }
        if(typeof(source)==='string'){
            this.setState({source:source})
        } else if(source.uri){
            setTimeout(()=>{
                this.downloadImage(source.imageName)
            },200)
        }

    }

    componentDidMount() {

    }

    render(){
        this.setImag();
       let {props,style={}} = this.props;
        return (
            <ImageBackground  source={this.state.source} {...props} style={style}  />
        )
    }

}

const styles = {
    main: {

    },
}





