import { Heading, Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    PopoverFooter,
    Card,
    CardBody
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import { allocatedQs, questDetails } from '../services';
import { useStore } from '../stores';
import { questiconBaseUrl } from '../constants';

export const AssignedQs = () => {
    const { loginStore } = useStore()
    const [currentId, setCurrentId] = useState<string>('')
    const { data: authTokenData } = useQuery({
        queryKey: ['authToken'],
        refetchOnWindowFocus: 'always'
    });

    const token = authTokenData ? authTokenData?.token : false;

    const {
        data: allocatedQsData
    } = useQuery({
        queryKey: ['allocatedQs', token],
        queryFn: () => allocatedQs(token),
        enabled: Boolean(token)
    });

    const {
        isError: questDetailsIsError,
        data: questDetailsData,
        fetchStatus: questDetailsFetchStatus
    } = useQuery({
        queryKey: ['questDetails', currentId],
        queryFn: () => questDetails(currentId, token),
        enabled: Boolean(currentId.length < 1 ? false : true)
    });

    const launchHandler = (id: string) => {
        window.open(`${questiconBaseUrl}?assignmentId=${id}&password=${loginStore.password}&username=${loginStore.username}`, '_blank');
    };

    return (
        <Card>
            <CardBody>
                <Heading size={'lg'}>Assignments</Heading>
                {
                    (allocatedQsData || []).map((qs: any, ind: number) => (
                        <Popover>
                            <PopoverTrigger>
                                <Button 
                                    onClick={() => setCurrentId(qs.assignmentId)}
                                >
                                    {qs.assignmentId}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow />
                                {
                                    questDetailsFetchStatus === 'fetching' ? 
                                        <PopoverBody>Loading...</PopoverBody> : (
                                        <>
                                            <PopoverCloseButton />
                                            <PopoverHeader>
                                                {
                                                    questDetailsIsError ? 
                                                        'Error' : 
                                                        questDetailsData?.questName
                                                }
                                            </PopoverHeader>
                                            <PopoverBody>
                                                {
                                                    questDetailsIsError ? 
                                                        '' : 
                                                        `Progress => Question ${questDetailsData?.progress.stepsCompleted} | ${questDetailsData?.progress.isQuestCompleted ? 'Completed' : 'Not completed'}`
                                                }
                                            </PopoverBody>
                                            <PopoverFooter display='flex' justifyContent='flex-end'>
                                                {
                                                    questDetailsIsError ? 
                                                        '' : (
                                                            <Button
                                                                onClick={() => launchHandler(qs.assignmentId)}
                                                            >
                                                                Launch on Questicon
                                                            </Button>
                                                        )
                                                }
                                            </PopoverFooter>
                                        </>
                                    )
                                }
                            </PopoverContent>
                        </Popover>
                    ))
                }
            </CardBody>
        </Card>
    )
};