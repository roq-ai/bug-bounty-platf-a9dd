import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createVulnerability } from 'apiSdk/vulnerabilities';
import { Error } from 'components/error';
import { vulnerabilityValidationSchema } from 'validationSchema/vulnerabilities';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ApplicationInterface } from 'interfaces/application';
import { UserInterface } from 'interfaces/user';
import { getApplications } from 'apiSdk/applications';
import { getUsers } from 'apiSdk/users';
import { VulnerabilityInterface } from 'interfaces/vulnerability';

function VulnerabilityCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: VulnerabilityInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createVulnerability(values);
      resetForm();
      router.push('/vulnerabilities');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<VulnerabilityInterface>({
    initialValues: {
      severity: 0,
      description: '',
      application_id: (router.query.application_id as string) ?? null,
      hacker_id: (router.query.hacker_id as string) ?? null,
    },
    validationSchema: vulnerabilityValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Vulnerability
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="severity" mb="4" isInvalid={!!formik.errors?.severity}>
            <FormLabel>Severity</FormLabel>
            <NumberInput
              name="severity"
              value={formik.values?.severity}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('severity', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.severity && <FormErrorMessage>{formik.errors?.severity}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>Description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ApplicationInterface>
            formik={formik}
            name={'application_id'}
            label={'Select Application'}
            placeholder={'Select Application'}
            fetcher={getApplications}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'hacker_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'vulnerability',
    operation: AccessOperationEnum.CREATE,
  }),
)(VulnerabilityCreatePage);
