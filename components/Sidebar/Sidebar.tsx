"use client";
import {
    useAuthContainer,
    useQuizContainer,
    useSidebarContainer,
} from "@/app/providers";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    BoxProps,
    Button,
    Center,
    CloseButton,
    Divider,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    Heading,
    Icon,
    IconButton,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
    Link,
    useColorMode,
    useMediaQuery,
    Tooltip,
} from "@chakra-ui/react";

import React, { ReactNode, useEffect, useState } from "react";

import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { ReactText } from "react";
import { Quiz } from "@/types/canvas";
import NextLink from "next/link";
import { getUploads } from "@/lib/functions";
import {
    SIDEBAR_WIDTH,
    NAVBAR_HEIGHT,
    FOOTER_HEIGHT,
    MINIMISED_SIDEBAR_WIDTH,
} from "@/lib/constants";
import useSidebar from "@/hooks/useSidebar";
import { SidebarContext } from "@/app/providers";

import MainLogo from "@/public/logos/main.png";
import MainLogoCA from "@/public/logos/mainLogoCA.png";
import Image from "next/image";

import {
    TbDoorExit,
    TbMoon,
    TbSun,
    TbSunLow,
    TbArrowRight,
    TbArrowLeft,
} from "react-icons/tb";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOutAll } from "@/firebase/auth";
import Navbar from "../Navbar/Navbar";
import CustomAlertDialog from "../Alert/CustomAlertDialog";
/**
 * Sidebar component.
 *
 * Displays the user's profile picture, name, and a list of links to navigate the app.
 *
 * Also displays the quizzes that the user has uploaded, sorted by course
 */
const Sidebar = () => {
    const { user } = useAuthContainer();
    // const [quizzes, setQuizzes] = useState<(Quiz & { id: string })[]>([]);

    // useEffect(() => {
    //     if (user) {
    //         getUploads(user.uid).then((data) => {
    //             setQuizzes(data.data || []);
    //         });
    //     }

    //     // if (user?.canvasApiToken) {
    //     //   setHasToken(true);
    //     // } else {
    //     //   setHasToken(false);
    //     // }
    // }, [user]);
    const { quizzes } = useQuizContainer();
    const { isOpenSidebar, setIsOpenSidebar } = useSidebarContainer();

    // group the quiz by course name
    const quizzesByCourse = quizzes
        .filter((quiz) => !quiz.quizSettings.isCustom)
        .reduce(
            (acc, quiz) => {
                if (!acc[quiz.course.split(" ")[0]]) {
                    acc[quiz.course.split(" ")[0]] = [];
                }
                acc[quiz.course.split(" ")[0]].push(quiz);
                return acc;
            },
            {} as Record<
                string,
                (Quiz & {
                    id: string;
                })[]
            >
        );

    const pinnedQuizzes = quizzes.filter((quiz) => quiz.quizSettings.isPinned);
    const customQuizzes = quizzes.filter((quiz) => quiz.quizSettings.isCustom);

    const customQuizzesByCourse = customQuizzes.reduce(
        (acc, quiz) => {
            if (!acc[quiz.course]) {
                acc[quiz.course] = [];
            }
            acc[quiz.course].push(quiz);
            return acc;
        },
        {} as Record<
            string,
            (Quiz & {
                id: string;
            })[]
        >
    );

    const { colorMode, toggleColorMode } = useColorMode();
    const helperColor = useColorModeValue("gray.600", "gray.400");
    const sidebarColor = useColorModeValue("white", "gray.900");

    // hide the welcome back and avatar if height is below 700px
    const [hideWelcome] = useMediaQuery("(max-height: 700px)");

    // for sign out alert
    const alertProps = useDisclosure();
    if (!user) return null;
    const handleToggleSidebar = () => {
        console.log("toggle sidebar" + isOpenSidebar);
        setIsOpenSidebar(!isOpenSidebar);
    };
    console.log(user.courseColors);
    return (
        <>
            {/* {!isOpen && ()}
        {isOpen && (<> */}
            <CustomAlertDialog
                headerText="Sign out"
                bodyText="Are you sure you want to sign out?"
                {...alertProps}
                ConfirmButton={
                    <Button
                        colorScheme={"red"}
                        onClick={() => {
                            alertProps.onClose();
                            signOutAll();
                        }}
                    >
                        {" "}
                        Sign out
                    </Button>
                }
            />
            <Box display={{ base: "block", md: "none" }} height={NAVBAR_HEIGHT}>
                <Navbar />
            </Box>
            <Box
                flexShrink={0}
                width={isOpenSidebar ? SIDEBAR_WIDTH : "60px"} // why does this not work but works iwth 15px
                height="100%"
                position="fixed"
                top={0}
                left={0}
                // bottom={FOOTER_HEIGHT}
                display={{ base: "none", md: "block" }}
                bgColor={sidebarColor}
                transition="width 0.1s ease-in-out"
            >
                {!isOpenSidebar && (
                    <Flex
                        alignItems="center"
                        mb={6}
                        flexDir={"column"}
                        justifyContent={"space-between"}
                        height="100%"
                    >
                        <Box marginTop="10px">
                            <Link as={NextLink} href="/">
                                <Image
                                    src={MainLogoCA}
                                    height="34"
                                    alt="Website logo"
                                />
                            </Link>
                        </Box>
                        <Flex
                            flexDir={"column"}
                            alignItems={"center"}
                            justifyContent="space-between"
                        >
                            <Tooltip
                                label={`Toggle ${
                                    colorMode === "light" ? "dark" : "light"
                                } mode`}
                            >
                                <Button
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                    colorScheme="gray"
                                >
                                    {colorMode === "light" ? (
                                        <TbMoon />
                                    ) : (
                                        <TbSun />
                                    )}
                                </Button>
                            </Tooltip>
                            <Tooltip label="Sign out">
                                <Button
                                    variant={"ghost"}
                                    colorScheme="gray"
                                    onClick={() => alertProps.onOpen()}
                                >
                                    <TbDoorExit />
                                </Button>
                            </Tooltip>
                            <Tooltip label={"Expand Sidebar"}>
                                <Button
                                    variant={"ghost"}
                                    colorScheme="gray"
                                    onClick={handleToggleSidebar}
                                >
                                    <TbArrowRight />
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Flex>
                )}

                {isOpenSidebar && (
                    <>
                        <Flex p={6} height="full" flexDir={"column"}>
                            <Flex alignItems="center" mb={6}>
                                <Link as={NextLink} href="/">
                                    <Image
                                        src={MainLogo}
                                        height="34"
                                        alt="Website logo"
                                    />
                                </Link>
                            </Flex>
                            {!hideWelcome ? (
                                <>
                                    <Center>
                                        <Avatar
                                            size="2xl"
                                            src={user?.photoURL}
                                            name={user?.displayName}
                                        />
                                    </Center>
                                    <Text mt={3} textAlign="center">
                                        {" "}
                                        Welcome back,{" "}
                                    </Text>
                                    <Heading fontSize="xl" textAlign={"center"}>
                                        {user?.displayName}!
                                    </Heading>
                                    <Divider my={6} />
                                </>
                            ) : (
                                <Text mb={3}>
                                    {" "}
                                    Hi,{" "}
                                    <span style={{ fontWeight: "semibold" }}>
                                        {" "}
                                        {user?.displayName}!{" "}
                                    </span>
                                </Text>
                            )}
                            <Text
                                textColor={helperColor}
                                fontWeight="bold"
                                fontSize="sm"
                                mb={3}
                            >
                                Pinned
                            </Text>
                            {pinnedQuizzes.length > 0 ? (
                                <Stack mb={6}>
                                    {pinnedQuizzes.map((quiz, i) => (
                                        <Button
                                            size="sm"
                                            colorScheme={"gray"}
                                            variant="ghost"
                                            textAlign={"left"}
                                            justifyContent="left"
                                            pl={0}
                                            textDecor="none"
                                            key={i}
                                        >
                                            <NextLink
                                                href={`/uploads/${quiz.id}`}
                                                className="sidebar-link"
                                            >
                                                <Flex
                                                    alignItems={"center"}
                                                    justifyContent="left"
                                                >
                                                    <Box
                                                        w="12px"
                                                        height="12px"
                                                        borderRadius="4px"
                                                        flexShrink={0}
                                                        bgColor={
                                                            user?.courseColors[
                                                                quiz.course.split(
                                                                    " "
                                                                )[0]
                                                            ] || "gray.500"
                                                        }
                                                        mr={2}
                                                    ></Box>
                                                    {quiz.quizName}
                                                </Flex>
                                            </NextLink>
                                        </Button>
                                    ))}
                                </Stack>
                            ) : (
                                <></>
                            )}

                            <Text
                                textColor={helperColor}
                                fontWeight="bold"
                                fontSize="sm"
                                mb={3}
                            >
                                Quick Access
                            </Text>
                            <Accordion overflowY="auto">
                                {Object.keys(quizzesByCourse).map(
                                    (courseCode) => {
                                        const quizzes =
                                            quizzesByCourse[courseCode];
                                        return (
                                            <AccordionItem
                                                key={courseCode}
                                                border={0}
                                            >
                                                <h2>
                                                    <AccordionButton>
                                                        <Box
                                                            as="span"
                                                            flex="1"
                                                            textAlign="left"
                                                            alignItems={
                                                                "center"
                                                            }
                                                            display="flex"
                                                            className="sidebar-link"
                                                        >
                                                            {/* <Icon
                                                    viewBox="0 0 200 200"
                                                    color={
                                                        user?.courseColors[
                                                            courseCode
                                                        ] || "gray.500"
                                                    }
                                                    mr={1}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                                                    />
                                                </Icon> */}
                                                            <Box
                                                                w="12px"
                                                                h="12px"
                                                                borderRadius="4px"
                                                                bgColor={
                                                                    user
                                                                        ?.courseColors[
                                                                        courseCode
                                                                    ] ||
                                                                    "gray.500"
                                                                }
                                                                mr={2}
                                                                flexShrink={0}
                                                            ></Box>
                                                            {courseCode}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4} px={1}>
                                                    <Stack>
                                                        {quizzes.map(
                                                            (quiz, i) => (
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme={
                                                                        "gray"
                                                                    }
                                                                    variant="ghost"
                                                                    textAlign={
                                                                        "left"
                                                                    }
                                                                    justifyContent="left"
                                                                    pl={2}
                                                                    textDecor="none"
                                                                    key={i}
                                                                >
                                                                    <NextLink
                                                                        href={`/uploads/${quiz.id}`}
                                                                        className="sidebar-link"
                                                                    >
                                                                        {
                                                                            quiz.quizName
                                                                        }
                                                                    </NextLink>
                                                                </Button>
                                                            )
                                                        )}
                                                    </Stack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        );
                                    }
                                )}
                            </Accordion>
                            <Text
                                textColor={helperColor}
                                fontWeight="bold"
                                fontSize="sm"
                                mb={3}
                            >
                                Custom
                            </Text>
                            <Accordion overflowY="auto" flexGrow={1}>
                                {Object.keys(customQuizzesByCourse).map(
                                    (courseCode) => {
                                        const quizzes =
                                            customQuizzesByCourse[courseCode];
                                        return (
                                            <AccordionItem
                                                key={courseCode}
                                                border={0}
                                            >
                                                <h2>
                                                    <AccordionButton>
                                                        <Box
                                                            as="span"
                                                            flex="1"
                                                            textAlign="left"
                                                            alignItems={
                                                                "center"
                                                            }
                                                            display="flex"
                                                            className="sidebar-link"
                                                        >
                                                            {/* <Icon
                                                    viewBox="0 0 200 200"
                                                    color={
                                                        user?.courseColors[
                                                            courseCode
                                                        ] || "gray.500"
                                                    }
                                                    mr={1}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                                                    />
                                                </Icon> */}
                                                            <Box
                                                                w="12px"
                                                                h="12px"
                                                                borderRadius="4px"
                                                                bgColor={
                                                                    user
                                                                        ?.courseColors[
                                                                        courseCode
                                                                    ] ||
                                                                    "gray.500"
                                                                }
                                                                data-help={
                                                                    courseCode
                                                                }
                                                                flexShrink={0}
                                                                mr={2}
                                                            ></Box>
                                                            {courseCode}
                                                        </Box>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4} px={1}>
                                                    <Stack>
                                                        {quizzes.map(
                                                            (quiz, i) => (
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme={
                                                                        "gray"
                                                                    }
                                                                    variant="ghost"
                                                                    textAlign={
                                                                        "left"
                                                                    }
                                                                    justifyContent="left"
                                                                    pl={2}
                                                                    textDecor="none"
                                                                    key={i}
                                                                >
                                                                    <NextLink
                                                                        href={`/uploads/${quiz.id}`}
                                                                        className="sidebar-link"
                                                                    >
                                                                        {
                                                                            quiz.quizName
                                                                        }
                                                                    </NextLink>
                                                                </Button>
                                                            )
                                                        )}
                                                    </Stack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        );
                                    }
                                )}
                            </Accordion>
                            <Flex
                                alignItems={"center"}
                                justifyContent="space-between"
                            >
                                <Tooltip
                                    label={`Toggle ${
                                        colorMode === "light" ? "dark" : "light"
                                    } mode`}
                                >
                                    <Button
                                        onClick={toggleColorMode}
                                        variant="ghost"
                                        colorScheme="gray"
                                    >
                                        {colorMode === "light" ? (
                                            <TbMoon />
                                        ) : (
                                            <TbSun />
                                        )}
                                    </Button>
                                </Tooltip>
                                <Tooltip label="Sign out">
                                    <Button
                                        variant={"ghost"}
                                        colorScheme="gray"
                                        onClick={() => alertProps.onOpen()}
                                    >
                                        <TbDoorExit />
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    label={
                                        isOpenSidebar
                                            ? "Minimize Sidebar"
                                            : "Expand Sidebar"
                                    }
                                >
                                    <Button
                                        variant={"ghost"}
                                        colorScheme="gray"
                                        onClick={handleToggleSidebar}
                                    >
                                        <TbArrowLeft />
                                    </Button>
                                </Tooltip>
                            </Flex>
                        </Flex>
                    </>
                )}

                {/* <Flex textAlign="right">
                    <Text
                        textColor={"gray.600"}
                        fontWeight="bold"
                        fontSize="sm"
                        mt={3}
                        w="full"
                    >
                        About us
                    </Text>
                </Flex> */}
            </Box>
            {/* </>)} */}
        </>
    );
};

export default Sidebar;
