import { Input, Heading, Button, Card, CardBody, CardFooter } from '@chakra-ui/react';
import React from 'react';
import { useQuery } from '@tanstack/react-query'
import { authToken } from '../services';
import { observer } from 'mobx-react';
import { useStore } from '../stores';

export const Login = observer(() => {
    const { loginStore } = useStore();
    const {
        fetchStatus,
        refetch
    } = useQuery({
        queryKey: ['authToken'],
        queryFn: () => authToken({ username: loginStore.username, password: loginStore.password }),
        enabled: false,
        refetchOnWindowFocus: 'always'
    });

    return (
        <Card maxW={'500px'}>
            <CardBody>
                <Heading size={'lg'}>Login</Heading> 
                <Input 
                    placeholder={'username'}
                    onChange={e => loginStore.setCredential('username', e.target.value)}
                    value={loginStore.username}
                />
                <Input
                    placeholder={'password'}
                    type={'password'}
                    onChange={e => loginStore.setCredential('password', e.target.value)}
                    value={loginStore.password}
                />
                <Input
                    placeholder={'profile id'}
                    type={'number'}
                    onChange={e => loginStore.setCredential('profileId', e.target.value)}
                    value={loginStore.profileId}
                />
                <CardFooter display='flex' justifyContent='flex-end'>
                    <Button
                        onClick={() => refetch()}
                        disabled={!(loginStore.username.length > 2 && loginStore.password.length > 2 && loginStore.profileId.length > 2) || fetchStatus === 'fetching'}
                    >
                        Login
                    </Button>
                </CardFooter>
            </CardBody>
        </Card>
    )
});
