import { Box } from "@mui/material";
import { forwardRef } from "react";

const AboluteBox = forwardRef( (props, ref) => {
    const { sx = {}, children, ...rest } = props;
    return <Box ref={ref} sx={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, ...sx }} {...rest} >
        {children}
    </Box>
})

export default AboluteBox