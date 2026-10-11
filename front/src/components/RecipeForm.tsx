import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { z } from 'zod'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { Close, Delete, UploadFile } from '@mui/icons-material'
import type { Recipe } from '../types'
import { recipeImage } from '../utils/placeholder'

const formSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(80, 'Keep it under 80 characters'),
    description: z
        .string()
        .trim()
        .min(1, 'Description is required')
        .max(300, 'Keep it under 300 characters'),
    image: z
        .string()
        .trim()
        .refine(
            (value) =>
                value === '' ||
                /^data:image\//i.test(value) ||
                /^https?:\/\/.+/i.test(value),
            'Upload a file or enter a valid image URL',
        ),
    prepTime: z.coerce
        .number()
        .int('Whole minutes only')
        .positive('Must be positive')
        .max(600, 'Too long'),
    servings: z.coerce
        .number()
        .int('Whole servings only')
        .positive('Must be positive')
        .max(50, 'Too many'),
    ingredients: z.string().trim().min(1, 'Add at least one ingredient'),
    steps: z.string().trim().min(1, 'Add at least one step'),
})

type FormState = {
    title: string
    description: string
    image: string
    prepTime: string
    servings: string
    ingredients: string
    steps: string
}

const emptyForm: FormState = {
    title: '',
    description: '',
    image: '',
    prepTime: '30',
    servings: '4',
    ingredients: '',
    steps: '',
}

type FormErrors = Partial<Record<keyof FormState, string>>

interface RecipeFormProps {
    open: boolean
    onClose: () => void
    onAdd: (recipe: Recipe) => void
}

export default function RecipeForm({ open, onClose, onAdd }: RecipeFormProps) {
    const [form, setForm] = useState<FormState>(emptyForm)
    const [errors, setErrors] = useState<FormErrors>({})
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleClose = () => {
        setForm(emptyForm)
        setErrors({})
        onClose()
    }

    const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) {
            return
        }
        const reader = new FileReader()
        reader.onload = () => {
            setForm((prev) => ({ ...prev, image: String(reader.result) }))
            setErrors((prev) => ({ ...prev, image: undefined }))
        }
        reader.readAsDataURL(file)
        event.target.value = ''
    }

    const clearImage = () => {
        setForm((prev) => ({ ...prev, image: '' }))
    }

    const handleChange =
        (field: keyof FormState) =>
            (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setForm((prev) => ({ ...prev, [field]: event.target.value }))
                setErrors((prev) => ({ ...prev, [field]: undefined }))
            }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const result = formSchema.safeParse(form)

        if (!result.success) {
            const nextErrors: FormErrors = {}
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof FormState | undefined
                if (key && !nextErrors[key]) {
                    nextErrors[key] = issue.message
                }
            }
            setErrors(nextErrors)
            return
        }

        const data = result.data
        const recipe: Recipe = {
            id: crypto.randomUUID(),
            title: data.title,
            description: data.description,
            image: data.image || recipeImage(data.title, Date.now()),
            prepTime: data.prepTime,
            servings: data.servings,
            ingredients: data.ingredients
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean),
            steps: data.steps
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean),
        }

        onAdd(recipe)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogTitle sx={{ pr: 7 }}>
                    Add a recipe
                    <IconButton
                        aria-label="Close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        fullWidth
                        required
                        margin="normal"
                        label="Title"
                        value={form.title}
                        onChange={handleChange('title')}
                        error={Boolean(errors.title)}
                        helperText={errors.title}
                    />
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        minRows={2}
                        label="Short description"
                        value={form.description}
                        onChange={handleChange('description')}
                        error={Boolean(errors.description)}
                        helperText={errors.description}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Image
                        </Typography>
                        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                            <Button
                                variant="outlined"
                                startIcon={<UploadFile />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload image
                            </Button>
                            {form.image && (
                                <Button
                                    variant="text"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={clearImage}
                                >
                                    Remove
                                </Button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFile}
                            />
                        </Stack>
                        {form.image && (
                            <Box
                                component="img"
                                src={form.image}
                                alt="Recipe preview"
                                sx={{
                                    mt: 1.5,
                                    width: '100%',
                                    height: 160,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                }}
                            />
                        )}
                        <TextField
                            fullWidth
                            size="small"
                            margin="normal"
                            label="Or paste an image URL"
                            value={form.image.startsWith('data:') ? '' : form.image}
                            onChange={handleChange('image')}
                            error={Boolean(errors.image)}
                            helperText={
                                errors.image ||
                                'Leave empty for a generated placeholder'
                            }
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            type="number"
                            label="Prep time (min)"
                            value={form.prepTime}
                            onChange={handleChange('prepTime')}
                            error={Boolean(errors.prepTime)}
                            helperText={errors.prepTime}
                        />
                        <TextField
                            fullWidth
                            required
                            margin="normal"
                            type="number"
                            label="Servings"
                            value={form.servings}
                            onChange={handleChange('servings')}
                            error={Boolean(errors.servings)}
                            helperText={errors.servings}
                        />
                    </Box>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        minRows={3}
                        label="Ingredients"
                        placeholder="One per line, or comma separated"
                        value={form.ingredients}
                        onChange={handleChange('ingredients')}
                        error={Boolean(errors.ingredients)}
                        helperText={errors.ingredients || 'One per line, or comma separated'}
                    />
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        multiline
                        minRows={3}
                        label="Steps"
                        placeholder="One step per line"
                        value={form.steps}
                        onChange={handleChange('steps')}
                        error={Boolean(errors.steps)}
                        helperText={errors.steps || 'One step per line'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Add recipe
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}
