import {IconEye, IconGauge, IconList, IconMessage2, IconShoppingCart, IconUser} from '@tabler/icons-react';
import {Container, Paper, SimpleGrid, Space, Stack, Text, ThemeIcon, Title} from '@mantine/core';
import classes from './Homepage.module.css';
import HeroClasses from "./Hero.module.css"
import React from "react";
import {QuickAnalyze} from "../../SeedInputAutoComplete.tsx";

export const Features = [
    {
        icon: IconGauge,
        title: 'Accuracy',
        description:
            'Blueprint uses Immolate to analyze Balatro seeds as opposed to a home grown approach this allows for more accurate results and a more reliable experience',
    },
    {
        icon: IconUser,
        title: 'Personalized experience',
        description:
            'You can customize how you want to view information for your seed, If you only want to see just enough to get by, or if you want to see everything possible',
    },
    {
        icon: IconEye,
        title: 'Card Spoilers',
        description:
            'You can choose to see what cards will be given to you by cards like: The Soul, Judgement, Wraith etc.',
    },
    {
        icon: IconShoppingCart,
        title: 'Card Buying',
        description:
            'You can buy cards and vouchers from the shop to generate a shopping list, as well as get a more accurate picture of what will appear in your run.',
    },
    {
        icon: IconList,
        title: 'In Depth',
        description:
            'The App supports viewing cards from several sources besides the shop including sources like uncommmon tags, 8-ball, purple seal etc.',
    },
    {
        icon: IconMessage2,
        title: 'Community',
        description:
            'The Balatro discord is a very helpful place, and you can often find me there to report bugs or ask for help. I am also open to suggestions and feedback.',
    },
];

interface FeatureProps {
    icon: React.FC<any>;
    title: React.ReactNode;
    description: React.ReactNode;
}

export function Feature({icon: Icon, title, description}: FeatureProps) {
    return (
        <Paper withBorder p={'1rem'} shadow={'lg'}>
            <ThemeIcon variant="light" size={40} radius={40}>
                <Icon size={18} stroke={1.5}/>
            </ThemeIcon>
            <Text mt="sm" mb={7}>
                {title}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
                {description}
            </Text>
        </Paper>
    );
}

function HeroText() {
    return (
        <Container fluid mb={'xl'}>
            <div className={HeroClasses.inner}>
                <Title className={HeroClasses.title}>
                    Fully featured {' '}
                    <Text component="span" className={HeroClasses.highlight} inherit>
                        seed-routing and analysis
                    </Text>{' '}
                    in a modern UI
                </Title>

                <Container p={0} size={600}>
                    <Text size="lg" c="dimmed" className={HeroClasses.description}>
                        Blueprint is a free, open-source tool for analyzing and routing seeds in the game Balatro.
                        It is designed to help players optimize their seed routing and improve their chances of winning.
                        It is not affiliated with the game or its developer.
                    </Text>
                </Container>

                <div className={HeroClasses.controls}>
                    <Stack gap={'sm'}>
                        <QuickAnalyze/>
                        <Text ta={'right'} fz={'sm'} c={'dimmed'}>
                            Want to search for seeds instead ?
                            Try {" "}
                            <Text
                                component={'a'}
                                fz={'sm'}
                                style={{ textDecoration: 'underline'}}
                                href={'https://github.com/OptimusPi/MotelyJAML/releases/tag/v1.0.0'}
                            >
                                MotelyJAML
                            </Text>
                            {" "}by pifreak
                        </Text>
                    </Stack>

                </div>

            </div>
        </Container>
    );
}

export function FeaturesGrid() {
    const features = Features.map((feature, index) => <Feature {...feature} key={index}/>);

    return (
        <Container className={classes.wrapper}>
            <HeroText/>
            <Space my={'xl'}/>
            <Paper p={'2rem'}>
                <SimpleGrid
                    mt={60}
                    cols={{base: 1, sm: 2, md: 3}}
                    spacing={{base: 'xl', md: 50}}
                    verticalSpacing={{base: 'xl', md: 50}}
                >
                    {features}
                </SimpleGrid>
            </Paper>
        </Container>
    );
}


export default function HomePage() {
    return (
        <Container fluid>
            <FeaturesGrid/>
        </Container>
    )
}