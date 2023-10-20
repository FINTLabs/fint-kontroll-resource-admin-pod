import React from 'react';
import Typography from "@mui/material/Typography";
import {Select} from "@navikt/ds-react";
import styled from "styled-components";

const ToolbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
`

interface ToolbarProps {
    selectedAccessRoleId: string,
    setSelectedAccessRoleId: (value: string) => void
}

export const PermissionsToolbarComponent = ({ selectedAccessRoleId, setSelectedAccessRoleId }: ToolbarProps) => {

    return (
        <ToolbarContainer>
            <h3>
                {selectedAccessRoleId ? selectedAccessRoleId : 'Velg aksessrolle:'}
            </h3>

            <Select
                value={selectedAccessRoleId?selectedAccessRoleId:''}
                onChange={(e) => setSelectedAccessRoleId(e.target.value as string)}
                label={"Rolle"}
            >
                <option value="" disabled>
                    Velg aksessrolle
                </option>
                <option value="aa">Applikasjonsadministrator</option>
                <option value="ata">Applikasjonstilgangsadministrator</option>
                <option value="e">Enhetsleder</option>
                <option value="s">Sluttbruker</option>
            </Select>
        </ToolbarContainer>
    );
};