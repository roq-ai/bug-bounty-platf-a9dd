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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getVulnerabilityById, updateVulnerabilityById } from 'apiSdk/vulnerabilities';
import { Error } from 'components/error';
import { vulnerabilityValidationSchema } from 'validationSchema/vulnerabilities';
import { VulnerabilityInterface } from 'interfaces/vulnerability';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ApplicationInterface } from 'interfaces/application';
import { UserInterface } from 'interfaces/user';
import { getApplications } from 'apiSdk/applications';
import { getUsers } from 'apiSdk/users';

function VulnerabilityEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<VulnerabilityInterface>(
    () => (id ? `/vulnerabilities/${id}` : null),
    () => getVulnerabilityById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: VulnerabilityInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateVulnerabilityById(id, values);
      mutate(updated);
      resetForm();
      router.push('/vulnerabilities');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<VulnerabilityInterface>({
    initialValues: data,
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
            Edit Vulnerability
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(VulnerabilityEditPage);
