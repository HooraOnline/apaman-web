import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import GridContainer from "components_creative/Grid/GridContainer.js";
import GridItem from "components_creative/Grid/GridItem.js";
import Small from "components_creative/Typography/Small.js";
import Danger from "components_creative/Typography/Danger.js";
import Warning from "components_creative/Typography/Warning.js";
import Success from "components_creative/Typography/Success.js";
import Info from "components_creative/Typography/Info.js";
import Primary from "components_creative/Typography/Primary.js";
import Muted from "components_creative/Typography/Muted.js";
import Quote from "components_creative/Typography/Quote.js";

import image1 from "public/static/assets/images/theme/screens/Screenshot_1.png";
import image2 from "public/static/assets/images/theme/screens/Screenshot_2.png";
import image3 from "public/static/assets/images/theme/screens/Screenshot_3.png";
import image4 from "public/static/assets/images/theme/screens/Screenshot_4.png";


import styles from "assets/jss/nextjs-material-kit/pages/componentsSections/typographyStyle.js";

const useStyles = makeStyles(styles);

export default function AboutApamanSection() {
    const classes = useStyles();
    return (
        <div className={classes.section}>
            <div className={classes.container}>
                <div id="typography">
                    <div className={classes.title}>
                        <h2>معرفی اپامن</h2>
                    </div>
                    <GridContainer>
                        <div style={{pading:100}} className={classes.typo}>
                            <p>
                                با اپلیکیشن اپامن شما می‌توانید تمامی رویدادها و نیازهای جاری
                                ساختمانتان را به ساده‌ترین و شفاف‌ترین شکل مدیریت کنید.
                            </p>

                        </div>
                        <div className={classes.typo}>
                            <ul className="mdc-list">
                                <li className="mdc-list-item" tabIndex="0">
                                    <span className="mdc-list-item__text">امکان رویت هزینه‌ها و درآمد ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text"> پرداخت شارژ و قبوض با امکان اتصال مستقیم و بی‌واسطه به درگاه مدیریت ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">امکان رزرو امکانات رفاهی ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">امکان درج انتقادات و پیشنهادات به مدیریت ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">امکان شرکت در نظرسنجی</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">مشاهده‌ی تابلوی اعلانات</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">مشاهده‌ی قوانین و مقررات ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text"> اطلاع از هرنوع رویداد تازه در ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">تماس با لابی، تأسیسات، مدیریت و اعضای هیئت مدیره ی ساختمان</span>
                                </li>
                                <li className="mdc-list-item">
                                    <span className="mdc-list-item__text">...</span>
                                </li>

                            </ul>
                        </div>
                        <div className={classes.typo}>
                            <div className={classes.note}>به زودی</div>
                            <Quote
                                text=" اما امکانات اپامن قرار نیست محدود به ساختمان بشه. ما به زودی امکانات جالبی د راپامن ایجاد می کنیم که هدف اون کاهش هزینه های نگهداری ساختمان و همینطور کاهش هزینه زندگی ساکنان ساختمان بخصوص برای مجتمع های بزرگ هست. خبرهای اپامن رو از بخش اخبار دنبال کنید."
                                author=""
                            />
                        </div>

                    </GridContainer>
                </div>
                <div className={classes.space50} />
                <div id="images">
                    <div className={classes.title}>
                        <h3>اپلیکیشن اپامن</h3>
                    </div>
                    <br />
                    <GridContainer>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>صفحه اصلی</h4>
                            <img
                                src={image1}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>امکانات اصلی</h4>
                            <img
                                src={image2}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>کنترل هزینه ها توسط مدیر</h4>
                            <img
                                src={image3}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>زمانبدی امکانات رفاهی ساختمان</h4>
                            <img
                                src={image4}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>Circle Raised</h4>
                            <img
                                src={image3}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                        <GridItem xs={12} sm={4} className={classes.marginLeft}>
                            <h4>Circle Raised</h4>
                            <img
                                src={image4}
                                alt="..."
                                className={
                                    classes.imgRaised +
                                    " " +
                                    classes.imgRounded +
                                    " " +
                                    classes.imgFluid
                                }
                            />
                        </GridItem>
                    </GridContainer>
                    <GridContainer />
                </div>
                <div className={classes.space50} />
            </div>
        </div>
    );
}
