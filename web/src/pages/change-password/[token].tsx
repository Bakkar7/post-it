import { Box, Button, Link } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink from 'next/link'


export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const router = useRouter()
    const [tokenError, setTokenError] = useState('')
    const [, changePassword] = useChangePasswordMutation()
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({ newPassword: values.newPassword, token });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(response.data.changePassword.errors)
                        if ('token' in errorMap) {
                            setTokenError(errorMap.token)
                        }
                        setErrors(errorMap)


                    } else if (response.data?.changePassword.user) {
                        // worked
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="New Password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError && <Box style={{ color: 'red' }} >{tokenError}
                            <NextLink href="/forgot-password">
                                <Link>Forget Again?</Link>
                            </NextLink>
                        </Box>
                        }

                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        >
                            Change Password
            </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}


// Getting the token from browser URL
// This is how to get in NextJs
ChangePassword.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}

export default withUrqlClient(createUrqlClient)(ChangePassword)