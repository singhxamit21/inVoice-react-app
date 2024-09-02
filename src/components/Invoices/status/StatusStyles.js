import styled, { css } from 'styled-components';
import { theme } from '../../theme';

export const StyledStatus = styled.div`
    width: 104px;
    padding: 13px 0;
    font-weight: 700;
    text-align: center;
    border-radius: 6px;
    transition: background-color 400ms ease-in-out, color 400ms ease-in-out;

    ${({ $statusType }) =>
        $statusType === 'draft' &&
        css`
            background-color: ${ theme.colors.statusDraftBg};
            color: ${ theme.colors.statusDraft};
        `}

    ${({ $statusType }) =>
        $statusType === 'pending' &&
        css`
            background-color: ${ theme.colors.statusPendingBg};
            color: ${ theme.colors.statusPending};
        `}

    ${({ $statusType }) =>
        $statusType === 'paid' &&
        css`
            background-color: ${ theme.colors.statusPaidBg};
            color: ${ theme.colors.statusPaid};
        `}

    ${({ $grid }) =>
        $grid &&
        css`
            grid-area: status;
            align-self: center;

            @media (min-width: 768px) {
                grid-area: unset;
                justify-self: end;
            }
        `}
`;

export const Circle = styled.span`
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
    transition: background-color 400ms ease-in-out;

    ${({ $statusType }) =>
        $statusType === 'draft' &&
        css`
            background-color: ${ theme.colors.statusDraft};
        `}
    ${({ $statusType }) =>
        $statusType === 'pending' &&
        css`
            background-color: ${ theme.colors.statusPending};
        `}
        ${({ $statusType }) =>
        $statusType === 'paid' &&
        css`
            background-color: ${ theme.colors.statusPaid};
        `};
`;
