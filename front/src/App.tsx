import { useMemo, useState } from 'react'
import {
    Alert,
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import { useRecipeMutations, useRecipes } from './hooks/useRecipes'
import { createAppTheme } from './theme'
import {
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    SORT_OPTIONS,
    filterRecipes,
    paginate,
    type SortOption,
} from './utils/recipes'
import type { Recipe, RecipeInput } from './types'

export default function App() {
    const [mode, setMode] = useState<PaletteMode>('light')
    const [search, setSearch] = useState('')
    const [favoritesOnly, setFavoritesOnly] = useState(false)
    const [sort, setSort] = useState<SortOption>('recent')
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [page, setPage] = useState(1)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [formOpen, setFormOpen] = useState(false)
    const [formSession, setFormSession] = useState(0)
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null)

    const { data: recipes = [], isLoading, isError, error } = useRecipes()
    const { create, update, remove, setFavorite } = useRecipeMutations()

    const theme = useMemo(() => createAppTheme(mode), [mode])

    const favoriteIds = useMemo(
        () => recipes.filter((recipe) => recipe.favorite).map((recipe) => recipe.id),
        [recipes],
    )

    const filtered = useMemo(
        () =>
            filterRecipes(recipes, {
                search,
                favoritesOnly,
                favorites: favoriteIds,
                sort,
            }),
        [recipes, search, favoritesOnly, favoriteIds, sort],
    )

    const { items: pageRecipes, pageCount, currentPage } = paginate(
        filtered,
        page,
        pageSize,
    )

    const selectedRecipe =
        recipes.find((recipe) => recipe.id === selectedId) ?? null

    const mutationError = create.error ?? update.error ?? remove.error ?? setFavorite.error

    const resetPage = () => setPage(1)

    const openAdd = () => {
        setEditingRecipe(null)
        setFormSession((prev) => prev + 1)
        setFormOpen(true)
    }

    const openEdit = (recipe: Recipe) => {
        setSelectedId(null)
        setEditingRecipe(recipe)
        setFormSession((prev) => prev + 1)
        setFormOpen(true)
    }

    const openDelete = (recipe: Recipe) => {
        setSelectedId(null)
        setDeleteTarget(recipe)
    }

    const handleSave = (input: RecipeInput) => {
        if (editingRecipe) {
            update.mutate({ id: editingRecipe.id, input })
        } else {
            create.mutate(input)
            resetPage()
        }
    }

    const handleToggleFavorite = (recipe: Recipe) => {
        setFavorite.mutate({ id: recipe.id, favorite: !recipe.favorite })
    }

    const confirmDelete = () => {
        if (deleteTarget) {
            remove.mutate(deleteTarget.id)
        }
        setDeleteTarget(null)
    }

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
                            onClick={openAdd}
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

                    {mutationError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {mutationError.message}
                        </Alert>
                    )}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : isError ? (
                        <Alert severity="error">
                            Could not load recipes: {error.message}
                        </Alert>
                    ) : pageRecipes.length === 0 ? (
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
                                        onOpen={(item) => setSelectedId(item.id)}
                                        onToggleFavorite={handleToggleFavorite}
                                        onEdit={openEdit}
                                        onDelete={openDelete}
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
                    onClose={() => setSelectedId(null)}
                    onToggleFavorite={handleToggleFavorite}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                <RecipeForm
                    key={formSession}
                    open={formOpen}
                    recipe={editingRecipe}
                    onClose={() => setFormOpen(false)}
                    onSave={handleSave}
                />

                <Dialog
                    open={deleteTarget !== null}
                    onClose={() => setDeleteTarget(null)}
                >
                    <DialogTitle>Delete recipe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Delete "{deleteTarget?.title}"? This cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    )
}
