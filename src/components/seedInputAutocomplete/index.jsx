import React from 'react';
import {SeedsWithLegendary} from "../../modules/const.js";
import {Autocomplete} from "@mantine/core";

export function SeedInputAutoComplete({ seed, setSeed }) {
    return (
        <Autocomplete
            flex={1}
            label={'Seed'}
            placeholder={'Enter Seed'}
            value={seed}
            onChange={(e) => setSeed(e)}
            data={[
                {
                    group: 'Popular Seeds',
                    items: [
                        '7LB2WVPK',
                        'PHQ8P93R',
                        '8Q47WV6K',
                        'CRNWYUXA'
                    ]
                },{
                    group: 'Generated Seeds With Legendary Jokers',
                    items: SeedsWithLegendary

                }
            ]}
        />
    );
};

