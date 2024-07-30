import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
export default function Prayer({ name , time , image }) {
    return (
        <Card sx={{ maxWidth: "14vw" }}>
            <CardMedia
            component="img"
            height="140"
            image={image}
            alt="Prayer img"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
                {time}
            </Typography>
            </CardContent>
        </Card>
    );
}
