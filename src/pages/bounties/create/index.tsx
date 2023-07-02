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
import { createBounty } from 'apiSdk/bounties';
import { Error } from 'components/error';
import { bountyValidationSchema } from 'validationSchema/bounties';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { VulnerabilityInterface } from 'interfaces/vulnerability';
import { getVulnerabilities } from 'apiSdk/vulnerabilities';
import { BountyInterface } from 'interfaces/bounty';

function BountyCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BountyInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBounty(values);
      resetForm();
      router.push('/bounties');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BountyInterface>({
    initialValues: {
      amount: 0,
      vulnerability_id: (router.query.vulnerability_id as string) ?? null,
    },
    validationSchema: bountyValidationSchema,
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
            Create Bounty
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="amount" mb="4" isInvalid={!!formik.errors?.amount}>
            <FormLabel>Amount</FormLabel>
            <NumberInput
              name="amount"
              value={formik.values?.amount}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.amount && <FormErrorMessage>{formik.errors?.amount}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<VulnerabilityInterface>
            formik={formik}
            name={'vulnerability_id'}
            label={'Select Vulnerability'}
            placeholder={'Select Vulnerability'}
            fetcher={getVulnerabilities}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.description}
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
    entity: 'bounty',
    operation: AccessOperationEnum.CREATE,
  }),
)(BountyCreatePage);
