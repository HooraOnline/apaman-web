import React,{useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Header from "components_creative/Header/Header.js";
import HeaderLinks from "components_creative/Header/HeaderLinks.js";
import Footer from "components_creative/Footer/Footer.js";
import GridContainer from "components_creative/Grid/GridContainer.js";
import GridItem from "components_creative/Grid/GridItem.js";
import Parallax from "components_creative/Parallax/Parallax.js";
import { i18n, withTranslation} from '../i18n'
import styles from "assets/jss/nextjs-material-kit/pages/components.js";
import AboutApamanSection from "./home/AboutApamanSection";
const useStyles = makeStyles(styles);

function Home(props) {
  const classes = useStyles();
  const { ...rest } = props;

  return (
    <div>
      <Header
        brand={
          <div>
            <img style={{borderRadius:25,height:50,width:50}} src={require("public/static/assets/images/theme/logo.png")} alt="..." />
          </div>
        }
        rightLinks={<HeaderLinks/>}
        fixed
        color="transparent"
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax image={require("assets/img/bg8.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div style={{alignItems:'center',}} className={classes.brand}>
                <h2 className={classes.title}>اپامن </h2>
                <h3 className={classes.subtitle}>
                  مدیریت هوشمند آپارتمان
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <AboutApamanSection/>
      </div>
      <Footer />
    </div>
  );
}

export default withTranslation('translation')(Home)
