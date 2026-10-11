import { useMemo, useState } from 'react'
import {
    Alert,
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Switch,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    type PaletteMode,
} from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import {
    Add,
    DarkMode,
    LightMode,
    RestaurantMenu,
    Search,
} from '@mui/icons-material'
import RecipeCard from './components/RecipeCard'
import RecipeDialog from './components/RecipeDialog'
import RecipeForm from './components/RecipeForm'
import { seedRecipes } from './data/recipes'
import { createAppTheme } from './theme'
import {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    SORT_OPTIONS,
    filterRecipes,
    paginate,
    type SortOption,
} from './utils/recipes'
import type { Recipe } from './types'

export default function App() {
    const [mode, setMode] = useState<PaletteMode>('light')
    const [recipes, setRecipes] = useState<Recipe[]>(seedRecipes)
    const [favorites, setFavorites] = useState<string[]>([])
    const [search, setSearch] = useState('')
    const [favoritesOnly, setFavoritesOnly] = useState(false)
    const [sort, setSort] = useState<SortOption>('recent')
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [page, setPage] = useState(1)
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
    const [formOpen, setFormOpen] = useState(false)

    const theme = useMemo(() => createAppTheme(mode), [mode])

    const filtered = useMemo(
        () =>
            filterRecipes(recipes, {
                search,
                favoritesOnly,
                favorites,
                sort,
            }),
        [recipes, search, favoritesOnly, favorites, sort],
    )

    const { items: pageRecipes, pageCount, currentPage } = paginate(
        filtered,
        page,
        pageSize,
    )

    const toggleFavorite = (id: string) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
    }

    const handleAdd = (recipe: Recipe) => {
        setRecipes((prev) => [recipe, ...prev])
        setPage(1)
    }

    const resetPage = () => setPage(1)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <AppBar position="sticky" color="default" elevation={1}>
                    <Toolbar>
                        <RestaurantMenu color="primary" sx={{ mr: 1.5 }} />
                        <Typography
                            variant="h6"
                            component="h1"
                            sx={{ flexGrow: 1, fontWeight: 700 }}
                        >
                            Przepisomat
                        </Typography>
                        <Tooltip
                            title={mode === 'light' ? 'Dark mode' : 'Light mode'}
                        >
                            <IconButton
                                color="inherit"
                                aria-label="Toggle dark mode"
                                onClick={() =>
                                    setMode((prev) =>
                                        prev === 'light' ? 'dark' : 'light',
                                    )
                                }
                                sx={{ mr: 1 }}
                            >
                                {mode === 'light' ? <DarkMode /> : <LightMode />}
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setFormOpen(true)}
                        >
                            Add recipe
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        useFlexGap
                        sx={{ mb: 3, alignItems: { xs: 'stretch', md: 'center' } }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search recipes..."
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value)
                                resetPage()
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={favoritesOnly}
                                    onChange={(event) => {
                                        setFavoritesOnly(event.target.checked)
                                        resetPage()
                                    }}
                                />
                            }
                            label="Favorites only"
                        />
                        <FormControl size="small" sx={{ minWidth: 170 }}>
                            <InputLabel id="sort-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-label"
                                label="Sort by"
                                value={sort}
                                onChange={(event) => {
                                    setSort(event.target.value as SortOption)
                                    resetPage()
                                }}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel id="page-size-label">Per page</InputLabel>
                            <Select
                                labelId="page-size-label"
                                label="Per page"
                                value={pageSize}
                                onChange={(event) => {
                                    setPageSize(Number(event.target.value))
                                    resetPage()
                                }}
                            >
                                {PAGE_SIZE_OPTIONS.map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    {pageRecipes.length === 0 ? (
                        <Alert severity="info">
                            No recipes match your filters yet. Try adjusting the
                            search.
                        </Alert>
                    ) : (
                        <Grid container spacing={3}>
                            {pageRecipes.map((recipe) => (
                                <Grid
                                    key={recipe.id}
                                    size={{ xs: 12, sm: 6, md: 4 }}
                                >
                                    <RecipeCard
                                        recipe={recipe}
                                        isFavorite={favorites.includes(recipe.id)}
                                        onOpen={setSelectedRecipe}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {filtered.length > 0 && (
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            useFlexGap
                            sx={{
                                mt: 4,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {filtered.length} recipe
                                {filtered.length === 1 ? '' : 's'}
                            </Typography>
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Stack>
                    )}
                </Container>

                <RecipeDialog
                    recipe={selectedRecipe}
                    isFavorite={
                        selectedRecipe
                            ? favorites.includes(selectedRecipe.id)
                            : false
                    }
                    onClose={() => setSelectedRecipe(null)}
                    onToggleFavorite={toggleFavorite}
                />

                <RecipeForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onAdd={handleAdd}
                />
            </Box>
        </ThemeProvider>
    )
}
