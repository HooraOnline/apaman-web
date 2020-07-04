import React, { Component } from "react";
import Router from "next/router";

import {withTranslation} from '../i18n'

class _error extends Component {
  componentDidMount = () => {
    Router.push("/components");
  };

  render() {
    const {statusCode, t} = this.props;
    return (
        <div className='err_container'>
          <p>
            {statusCode
                ? t('error-with-status', {statusCode})
                : t('error-without-status')}
          </p>
          <style jsx>{`
            .err_container {           
              align-items: center;
              justify-content: center;
              align-self: center;
              background-color: #9ef859;
              flex: 1;
            }  
        `}</style>
        </div>
    );
  }
}

export default withTranslation('translation')(_error)
