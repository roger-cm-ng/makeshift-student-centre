import { 
    Button,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
    Card,
    CardBody
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react';
import { assignment, unallocatedQs } from '../services';
import { useStore } from '../stores';
import { questiconBaseUrl } from '../constants';
import { SingleAssignmentProps } from './available-qs.types';
import React from 'react';

export const AvailableQs = () => {
    const toast = useToast();
    const { loginStore } = useStore();
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState<string | null>(null);

    let token: string | boolean = '';
    let list: SingleAssignmentProps[] | [] = [];

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data: authTokenData } = useQuery({
        queryKey: ['authToken'],
        refetchOnWindowFocus: 'always'
    });

    token = authTokenData ? authTokenData.token : false;

    const {
        data: unallocatedQsData
    } = useQuery({
        queryKey: ['unallocatedQs', token],
        queryFn: () => unallocatedQs(token),
        enabled: Boolean(token)
    });

    list = unallocatedQsData ? unallocatedQsData : [];

    const {
        error: assignmentError,
        data: assignmentData,
        refetch: assignmentRefetch
    } = useQuery({
        queryKey: ['assignment', currentId],
        queryFn: () => assignment({ questionSetId: currentId || '', studentUserProfileId: loginStore.profileId, authToken: token }),
        enabled: false
    });

    const onModalHandler = (id: any, title: any) => {
        setCurrentId(id);
        setCurrentTitle(title);
        onOpen();
    };
    
    useMemo(() => {
        onClose();
        if (assignmentData) {
            window.open(`${questiconBaseUrl}?assignmentId=${assignmentData.assignmentId}&password=${loginStore.password}&username=${loginStore.username}`, '_blank');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentData]);

    useMemo(() => {
        if (assignmentError) {
            toast({
                title: 'Server error: refresh the token by clicking the Login button again',
                status: 'error',
                isClosable: true 
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentError]);

    return (
        <Card>
            <CardBody>
                <Heading size={'lg'}>Available question sets</Heading>
                    {
                        list.map((qs, ind: number) => (
                            <Button key={ind} onClick={() => onModalHandler(qs.id, qs.title)}>{qs.title}</Button>
                        ))
                    }
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{currentTitle}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody display='flex' justifyContent='flex-end'>
                            <Button
                                onClick={() => assignmentRefetch()}
                            >
                                Launch on Questicon
                            </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </CardBody>
        </Card>
    )
};