import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    IconButton,
    Typography,
} from '@mui/material'
import { Favorite, FavoriteBorder, Schedule } from '@mui/icons-material'
import type { Recipe } from '../types'

interface RecipeCardProps {
    recipe: Recipe
    isFavorite: boolean
    onOpen: (recipe: Recipe) => void
    onToggleFavorite: (id: string) => void
}

export default function RecipeCard({
    recipe,
    isFavorite,
    onOpen,
    onToggleFavorite,
}: RecipeCardProps) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 6,
                },
            }}
        >
            <CardActionArea
                onClick={() => onOpen(recipe)}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    '& .MuiCardActionArea-focusHighlight': {
                        display: 'none',
                    },
                }}
            >
                <CardMedia
                    component="img"
                    image={recipe.image}
                    alt={recipe.title}
                    sx={{
                        width: '100%',
                        aspectRatio: '16 / 10',
                        objectFit: 'cover',
                    }}
                />
                <CardContent
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        boxSizing: 'border-box',
                        height: 132,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        gutterBottom
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {recipe.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {recipe.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Chip
                    icon={<Schedule />}
                    label={`${recipe.prepTime} min`}
                    size="small"
                    variant="outlined"
                />
                <Box>
                    <IconButton
                        aria-label={
                            isFavorite ? 'Remove from favorites' : 'Add to favorites'
                        }
                        color={isFavorite ? 'secondary' : 'default'}
                        onClick={() => onToggleFavorite(recipe.id)}
                    >
                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                </Box>
            </CardActions>
        </Card>
    )
}
