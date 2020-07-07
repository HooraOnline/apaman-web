import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import {deviceWide, getHeight, getWidth} from "../utils";
import useWindowDimensions from "../hooks/windowDimensions";
import View from "./View";

const ExpansionPanel = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: '0px solid rgba(0, 0, 0, .125)',
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    //backgroundColor: 'rgba(0, 0, 0, .03)',
    marginBottom: -1,
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);


export default function SectionList(props) {
  const [expanded, setExpanded] = React.useState(props.expendedIndex);
  const [height, setHeight] = useState(global.height);
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setHeight(getHeight());

  }, []);

  if(!props.sections || props.sections.length==0){
    return (props.ListEmptyComponent || null)
  }
  return (
      <div style={{overflowY:'hide',position:'relative'}} >
        {
          props.sections.map((section, sectionIndex) => {
            return (
                <ExpansionPanel key={sectionIndex}  style={props.style} square expanded={expanded === sectionIndex} onChange={handleChange(sectionIndex)}>
                  <ExpansionPanelSummary style={props.headerStyle} aria-controls="panel1d-content" id="panel1d-header">
                    {
                      props.renderSectionHeader(section,sectionIndex,expanded === sectionIndex)
                    }
                  </ExpansionPanelSummary>

                  <ExpansionPanelDetails style={props.chidStyle}>
                    <View  style={{flex:1}}>
                      {
                        section.data.map((child, index) =>
                            <View  key={index} style={{}}>
                              {
                                props.renderItem(child, section, index)
                              }
                            </View>
                        )
                      }
                    </View>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
            )
          })
        }


      </div>
  );
}
