import {
    Box,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import {
    Close,
    DeleteOutlined,
    Edit,
    Favorite,
    FavoriteBorder,
    People,
    Restaurant,
    Schedule,
} from '@mui/icons-material'
import type { Recipe } from '../types'
import { recipeImageSrc } from '../utils/recipes'

interface RecipeDialogProps {
    recipe: Recipe | null
    onClose: () => void
    onToggleFavorite: (recipe: Recipe) => void
    onEdit: (recipe: Recipe) => void
    onDelete: (recipe: Recipe) => void
}

export default function RecipeDialog({
    recipe,
    onClose,
    onToggleFavorite,
    onEdit,
    onDelete,
}: RecipeDialogProps) {
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Dialog
            open={recipe !== null}
            onClose={onClose}
            fullScreen={fullScreen}
            maxWidth="md"
            fullWidth
        >
            {recipe && (
                <>
                    <DialogTitle sx={{ pr: 16 }}>
                        {recipe.title}
                        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                            <IconButton
                                aria-label="Edit recipe"
                                onClick={() => onEdit(recipe)}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton
                                aria-label="Delete recipe"
                                onClick={() => onDelete(recipe)}
                            >
                                <DeleteOutlined />
                            </IconButton>
                            <IconButton aria-label="Close" onClick={onClose}>
                                <Close />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box
                            component="img"
                            src={recipeImageSrc(recipe)}
                            alt={recipe.title}
                            sx={{
                                width: '100%',
                                height: { xs: 200, sm: 300 },
                                objectFit: 'cover',
                                borderRadius: 2,
                                mb: 2,
                            }}
                        />
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {recipe.description}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                            <Chip icon={<Schedule />} label={`${recipe.prepTime} min`} />
                            <Chip icon={<People />} label={`${recipe.servings} servings`} />
                            <Chip
                                icon={recipe.favorite ? <Favorite /> : <FavoriteBorder />}
                                label={recipe.favorite ? 'Favorite' : 'Not favorite'}
                                color={recipe.favorite ? 'secondary' : 'default'}
                                variant="outlined"
                                onClick={() => onToggleFavorite(recipe)}
                            />
                        </Stack>

                        <Typography variant="h6" gutterBottom>
                            Ingredients
                        </Typography>
                        <List dense disablePadding sx={{ mb: 2 }}>
                            {recipe.ingredients.map((ingredient, index) => (
                                <ListItem key={index} disableGutters>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Restaurant fontSize="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={ingredient} />
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Preparation
                        </Typography>
                        <List dense>
                            {recipe.steps.map((step, index) => (
                                <ListItem key={index} alignItems="flex-start">
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Chip label={index + 1} size="small" color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={step} />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                </>
            )}
        </Dialog>
    )
}
