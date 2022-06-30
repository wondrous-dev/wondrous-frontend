import React from 'react';
import { Text } from './styles';

export const Text2 = () => {
    return (
        <div>
            <Text width={256}>text</Text>
            <Text display="inline-block">text</Text>
            <Text maxWidth={1024}>text</Text>
            <Text minWidth={128}>text</Text>
            <Text height={64}>text</Text>
            <Text maxHeight={512}>text</Text>
            <Text minHeight={12}>text</Text>
            <Text size={32}>text</Text>
            <Text overflow="hidden">text</Text>
            <Text fontSize={32}>text</Text>
            <Text fontFamily="mono">text</Text>
            <Text fontWeight="bold">text</Text>
            <Text textAlign="center">text</Text>
            <Text lineHeight="1.25">text</Text>
            <Text letterSpacing="0.1em">text</Text>
            <Text color="blue">text</Text>
            <Text bg="blue">text</Text>
            <Text m={2}>text</Text>
            <Text mt={6}>text</Text>
            <Text mb={4}>text</Text>
            <Text mr={5}>text</Text>
            <Text ml={3}>text</Text>
            <Text p={8}>text</Text>
            <Text pt={5}>text</Text>
            <Text pb={5}>text</Text>
            <Text pl={5}>text</Text>
            <Text pr={5}>text</Text>
        </div>
    );
};
