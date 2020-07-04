import ImageLoader from "react-loading-image/lib";
import CircularProgress from '@material-ui/core/CircularProgress';
import {getImageBase64Query} from "../network/Queries";
import {PureComponent} from "react";
import {fa} from "../language/fa";
import {Image} from "../react-native";
import images from "../../public/static/assets/images";

export default class ImageCacheProgress extends PureComponent{
    constructor(props) {
        super();
        this.state = {

            loadedImage:false,
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
                this.setState({loadingImage: false, imageData: result});
            })
            .catch(e =>{
                this.setState({loadingImage: false});
            } );
    }
    setImag=(imageData)=>{
        if(imageData){
            return;
        }
        let source=this.props.source;
        if(source && source.uri){
            this.downloadImage(source.uri);
        }



    }

    componentDidMount() {

    }

    render(){
        if(!this.props.source){
            return (<Image style={this.props.style} source={this.props.defaltImage || images.default_ProPic}/>)
        }

        this.setImag(this.state.imageData);
        return (
            <ImageLoader
                {...this.props}
                src={this.state.imageData}
                loading={() => <CircularProgress/>}
                error={() => <Image style={this.props.style} source={this.props.defaltImage || images.default_ProPic}/>}

            />
        )
    }

}

const styles = {
    main: {

    },
}


