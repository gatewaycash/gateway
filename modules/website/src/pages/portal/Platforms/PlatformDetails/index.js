import React from 'react'
import {
  Button,
  IconButton,
  Card,
  CardContent,
  withStyles
} from '@material-ui/core'
import styles from './style'
import PropTypes from 'prop-types'
import CommissionList from './CommissionList'
import { WarningTwoTone, Check, Close } from '@material-ui/icons'
import { Provider, Context } from './CommissionList/CommissionListContext'
import { EditableText } from 'components'
import {
  Provider as EditableTextContextProvider,
  Context as EditableTextContext
} from 'components/EditableText'
import { patchPlatform } from 'API'

const PlatformDetails = ({
  selectedPlatform,
  setSelectedPlatform,
  classes,
  updatePlatformList
}) => {
  const savePlatform = async form => {
    return (await patchPlatform(form)).json()
  }
  return (
    <Card>
      <CardContent>
        <Card>
          <CardContent classes={{ root: classes.notice_card_root }}>
            <WarningTwoTone className={classes.notice_icon} />
            <span>
              <strong>Notice:</strong> The Platforms API is Currently in Alpha
            </span>
          </CardContent>
        </Card>
        {selectedPlatform && (
          <React.Fragment>
            <EditableTextContextProvider>
              <EditableTextContext.Consumer>
                {context => (
                  <form>
                    <input
                      type="hidden"
                      name="APIKey"
                      value={selectedPlatform.APIKey}
                    />
                    <input
                      type="hidden"
                      name="platformID"
                      value={selectedPlatform.platformID}
                    />
                    <div className={classes.selected_platform_title_wrap}>
                      <div className={classes.editable_text_wrapper}>
                        <h1
                          className={
                            context.editable ? classes.edit_input_wrap : ''
                          }
                        >
                          <EditableText
                            value={selectedPlatform.name}
                            TextFieldProps={{
                              name: 'newName',
                              InputProps: {
                                classes: {
                                  input: classes.title_edit_input
                                }
                              }
                            }}
                          >
                            {selectedPlatform.name}
                          </EditableText>
                        </h1>
                        <span>ID: {selectedPlatform.platformID}</span>
                        <EditableText
                          value={selectedPlatform.description}
                          TextFieldProps={{
                            name: 'newDescription',
                            InputProps: {
                              classes: {
                                root: classes.edit_input_wrap
                              }
                            },
                            classes: {
                              root: classes.textfield
                            },
                            multiline: true,
                            rows: '2',
                            rowsMax: '5'
                          }}
                        >
                          <p className={classes.selected_platform_description}>
                            {selectedPlatform.description}
                          </p>
                        </EditableText>
                      </div>
                      {context.editable ? (
                        <div className={classes.edit_controls}>
                          <IconButton
                            className={classes.save_platform}
                            onClick={ev =>
                              savePlatform(ev.target.form).then(platform => {
                                context.setEditable(false)
                                setSelectedPlatform({
                                  name: platform.newName,
                                  description: platform.newDescription,
                                  platformID: platform.platformID
                                })
                                updatePlatformList()
                              })
                            }
                          >
                            <Check />
                          </IconButton>
                          <IconButton
                            onClick={() => context.setEditable(false)}
                          >
                            <Close />
                          </IconButton>
                        </div>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() => context.setEditable(true)}
                        >
                          EDIT
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </EditableTextContext.Consumer>
            </EditableTextContextProvider>
            <Provider>
              <Context.Consumer>
                {context => (
                  <CommissionList
                    platformID={selectedPlatform.platformID}
                    context={context}
                  />
                )}
              </Context.Consumer>
            </Provider>
          </React.Fragment>
        )}
      </CardContent>
    </Card>
  )
}

PlatformDetails.propTypes = {
  classes: PropTypes.object,
  selectedPlatform: PropTypes.object,
  setSelectedPlatform: PropTypes.func,
  updatePlatformList: PropTypes.func
}

export default withStyles(styles)(PlatformDetails)
