import { useTheme } from "@mui/material";

type Props = {
    text: string;
    query?: string;
};

const HighlightedText = (props: Props) => {

    const {
        text,
        query = '',
    } = props;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    const theme = useTheme();

    if (!query) return text;

    return (
        <>
            {
                parts.map((part, i) => {
                    if (part.toLowerCase() !== query.toLowerCase()) return part;
                    return (
                        <span key={i} style={{ backgroundColor: theme.palette.primary.main, color: 'white' }}>
                            {part}
                        </span>
                    )
                })
            }
        </>
    );
}

export default HighlightedText;