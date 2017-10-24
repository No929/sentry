import {Box} from 'grid-emotion';
import PropTypes from 'prop-types';
import React from 'react';

import {
  addErrorMessage,
  addSuccessMessage
} from '../../../../actionCreators/settingsIndicator';
import {t} from '../../../../locale';
import ApiMixin from '../../../../mixins/apiMixin';
import BooleanField from '../../../../components/forms/next/booleanField';
import Form from '../../../../components/forms/next/form';
import Panel from '../../../../components/forms/next/styled/panel';
import PanelBody from '../../../../components/forms/next/styled/panelBody';
import PanelHeader from '../../../../components/forms/next/styled/panelHeader';
import Select2Field from '../../../../components/forms/next/select2Field';
import TextField from '../../../../components/forms/next/textField';
import TextareaField from '../../../../components/forms/next/textareaField';

const NewOrganizationSettingsForm = React.createClass({
  propTypes: {
    orgId: PropTypes.string.isRequired,
    access: PropTypes.object.isRequired,
    initialData: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  },

  mixins: [ApiMixin],

  getInitialState() {
    return {
      formData: this.buildFormData(this.props.initialData),
      errors: {},
      hasChanges: false
    };
  },

  buildFormData(data) {
    let result = {
      name: data.name,
      slug: data.slug,
      openMembership: data.openMembership,
      allowSharedIssues: data.allowSharedIssues,
      isEarlyAdopter: data.isEarlyAdopter,
      enhancedPrivacy: data.enhancedPrivacy,
      dataScrubber: data.dataScrubber,
      dataScrubberDefaults: data.dataScrubberDefaults,
      scrubIPAddresses: data.scrubIPAddresses,
      safeFields: data.safeFields.join('\n'),
      sensitiveFields: data.sensitiveFields.join('\n')
    };
    if (this.props.access.has('org:admin')) {
      result.defaultRole = data.defaultRole;
    }
    return result;
  },

  render() {
    let {access, initialData, orgId} = this.props;

    let sensitiveFieldsHelp = (
      <span>
        {t(
          'Additional field names to match against when scrubbing data for all projects. Separate multiple entries with a newline.'
        )}
        <br />
        <strong>
          {t('Note: These fields will be used in addition to project specific fields.')}
        </strong>
      </span>
    );

    let safeFieldsHelp = (
      <span>
        {t(
          'Field names which data scrubbers should ignore. Separate multiple entries with a newline.'
        )}
        <br />
        <strong>
          {t('Note: These fields will be used in addition to project specific fields.')}
        </strong>
      </span>
    );

    return (
      <Form
        apiMethod="PUT"
        apiEndpoint={`/organizations/${orgId}/`}
        saveOnBlur
        allowUndo
        initialData={initialData}
        onSubmitSuccess={() => addSuccessMessage('Change saved', 3000)}
        onSubmitError={() => addErrorMessage('Unable to save change', 3000)}>
        <Box>
          <Panel>
            <PanelHeader>
              {t('General')}
            </PanelHeader>

            <PanelBody>

              <TextField
                name="name"
                label={t('Name')}
                help={t('The name of your organization. e.g. My Company')}
                required={true}
              />
              <TextField
                name="slug"
                label={t('Short name')}
                help={t('A unique ID used to identify this organization.')}
                required={true}
              />
              <BooleanField
                name="isEarlyAdopter"
                label={t('Early Adopter')}
                help={t("Opt-in to new features before they're released to the public.")}
                required={false}
              />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              {t('Membership')}
            </PanelHeader>

            <PanelBody>

              {access.has('org:admin') &&
                <Select2Field
                  name="defaultRole"
                  label={t('Default Role')}
                  choices={initialData.availableRoles.map(r => [r.id, r.name])}
                  help={t('The default role new members will receive.')}
                  required={true}
                />}

              <BooleanField
                name="openMembership"
                label={t('Open Membership')}
                help={t('Allow organization members to freely join or leave any team.')}
                required={true}
              />
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader>
              {t('Security & Privacy')}
            </PanelHeader>

            <PanelBody>

              <BooleanField
                name="allowSharedIssues"
                label={t('Allow Shared Issues')}
                help={t(
                  'Enable sharing of limited details on issues to anonymous users.'
                )}
                required={false}
              />

              <BooleanField
                name="enhancedPrivacy"
                label={t('Enhanced Privacy')}
                help={t(
                  'Enable enhanced privacy controls to limit personally identifiable information (PII) as well as source code in things like notifications.'
                )}
                required={false}
              />

              <BooleanField
                name="dataScrubber"
                label={t('Require Data Scrubber')}
                help={t(
                  'Require server-side data scrubbing be enabled for all projects.'
                )}
                required={false}
              />

              <BooleanField
                name="dataScrubberDefaults"
                label={t('Require Using Default Scrubbers')}
                help={t(
                  'Require the default scrubbers be applied to prevent things like passwords and credit cards from being stored for all projects.'
                )}
                required={true}
              />

              <TextareaField
                name="sensitiveFields"
                label={t('Global sensitive fields')}
                help={sensitiveFieldsHelp}
                placeholder={t('e.g. email')}
                required={false}
              />

              <TextareaField
                name="safeFields"
                label={t('Global safe fields')}
                help={safeFieldsHelp}
                placeholder={t('e.g. email')}
                required={false}
              />

              <BooleanField
                name="scrubIPAddresses"
                label={t('Prevent Storing of IP Addresses')}
                help={t(
                  'Preventing IP addresses from being stored for new events on all projects.'
                )}
                required={false}
              />
            </PanelBody>
          </Panel>
        </Box>
      </Form>
    );
  }
});

export default NewOrganizationSettingsForm;