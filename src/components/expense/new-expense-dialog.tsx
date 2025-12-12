'use client';

import type React from 'react';
import { type RefObject, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronsUpDown, Plus, Minus, SquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const expenseSchema = z.object({
    date: z.date(),
    employeeId: z.string().min(1, 'Employee is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    paymentMethod: z.enum(['cash', 'kpay']),
    carId: z.string().optional(),
    note: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const employees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
    { id: '4', name: 'Alice Brown' },
];

const cars = [
    { id: '1', number: 'ABC-123', model: 'Toyota Camry' },
    { id: '2', number: 'XYZ-789', model: 'Honda Civic' },
    { id: '3', number: 'DEF-456', model: 'Ford Ranger' },
    { id: '4', number: 'GHI-789', model: 'Toyota Hilux' },
];

const expenseCategories = [
    'Fuel',
    'Maintenance',
    'Repair',
    'Insurance',
    'Parking',
    'Tolls',
    'Cleaning',
    'Parts',
    'License',
    'Other',
];

const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'kpay', label: 'KPay' },
];

function NewExpenseDialog() {
    const employeeBtnRef: RefObject<HTMLButtonElement | null> = useRef(null);
    const carBtnRef: RefObject<HTMLButtonElement | null> = useRef(null);
    const [emplyeeBtnWidth, setEmplyeeBtnWidth] = useState(0);
    const [carBtnWidth, setCarBtnWidth] = useState(0);

    const [isEmployeeOpen, setEmployeeOpen] = useState(false);
    const [isCarOpen, setCarOpen] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
    } = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseSchema),
        defaultValues: {
            date: new Date(),
            employeeId: '',
            category: '',
            amount: 100000,
            paymentMethod: 'cash',
            carId: undefined,
            note: '',
        },
    });

    const onSubmit = (data: ExpenseFormValues) => {
        console.log('Form data:', data);
        // form.reset();
    };

    // just demo
    const incrementAmount = () => {
        const currentAmount = getValues('amount') || 0;
        const newAmount = Number((currentAmount + 50000).toFixed(2));
        if (newAmount < 5000000) {
            setValue('amount', newAmount);
        } else {
            setValue('amount', currentAmount);
        }
    };

    // just demo
    const decrementAmount = () => {
        const currentAmount = getValues('amount') || 0;
        const newAmount = Number((currentAmount - 500000).toFixed(2));
        if (newAmount > 0 && newAmount < 500000) {
            setValue('amount', newAmount);
        } else if (currentAmount >= 0) {
            setValue('amount', currentAmount);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!Number.isNaN(value) && Number(value) <= 5000000) {
            setValue('amount', value);
        } else {
            setValue('amount', 0);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">
                    <SquarePlus className="w-4 h-4" />
                    New Expense
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[90vh] overflow-y-auto">
                    {/* Date */}
                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Date *</FieldLabel>
                                <FieldGroup>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() ||
                                                    date < new Date('1900-01-01')
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FieldGroup>
                                {errors.date && <FieldError>{errors.date.message}</FieldError>}
                            </Field>
                        )}
                    />

                    {/* Employee */}
                    <Controller
                        control={control}
                        name="employeeId"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Employee *</FieldLabel>
                                <FieldGroup>
                                    <Popover open={isEmployeeOpen} onOpenChange={setEmployeeOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                ref={employeeBtnRef}
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                                onClick={() => {
                                                    if (employeeBtnRef.current) {
                                                        setEmplyeeBtnWidth(
                                                            employeeBtnRef.current.offsetWidth
                                                        );
                                                    }
                                                }}
                                            >
                                                {field.value
                                                    ? employees.find(
                                                          (emp) => emp.id === field.value
                                                      )?.name
                                                    : 'Select employee'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-0"
                                            style={{
                                                width:
                                                    emplyeeBtnWidth > 0 ? emplyeeBtnWidth : 'auto',
                                            }}
                                        >
                                            {/* used command just for quick demo */}
                                            <Command>
                                                <CommandInput placeholder="Search employee..." />
                                                <CommandEmpty>No employee found.</CommandEmpty>
                                                <CommandGroup>
                                                    {employees.map((emp) => (
                                                        <CommandItem
                                                            value={emp.name}
                                                            key={emp.id}
                                                            onSelect={() => {
                                                                setValue('employeeId', emp.id);
                                                                setEmployeeOpen(false);
                                                            }}
                                                        >
                                                            <span>{emp.name}</span>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FieldGroup>
                                {errors.employeeId && (
                                    <FieldError>{errors.employeeId.message}</FieldError>
                                )}
                            </Field>
                        )}
                    />

                    {/* Amount */}
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Amount *</FieldLabel>
                                    <FieldGroup>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={decrementAmount}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="relative flex-1">
                                                <Input
                                                    type="number"
                                                    step="10000"
                                                    min="0"
                                                    max={5000000}
                                                    className="pl-8 text-center"
                                                    value={field.value || ''}
                                                    onChange={handleAmountChange}
                                                    onBlur={field.onBlur}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={incrementAmount}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </FieldGroup>
                                    {errors.amount && (
                                        <FieldError>{errors.amount.message}</FieldError>
                                    )}
                                </Field>
                            )}
                        />

                        {/* Payment Method */}
                        <Controller
                            control={control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Payment Method *</FieldLabel>
                                    <FieldGroup>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className="min-w-full">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentMethods.map((method) => (
                                                    <SelectItem
                                                        key={method.value}
                                                        value={method.value}
                                                    >
                                                        {method.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldGroup>
                                    {errors.paymentMethod && (
                                        <FieldError>{errors.paymentMethod.message}</FieldError>
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Category*/}
                    <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Category *</FieldLabel>
                                <FieldGroup>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {expenseCategories.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FieldGroup>
                                {errors.category && (
                                    <FieldError>{errors.category.message}</FieldError>
                                )}
                            </Field>
                        )}
                    />

                    {/* Car */}
                    <Controller
                        control={control}
                        name="carId"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Car Number (Optional)</FieldLabel>
                                <FieldGroup>
                                    <Popover open={isCarOpen} onOpenChange={setCarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                ref={carBtnRef}
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    'w-full justify-between',
                                                    !field.value && 'text-muted-foreground'
                                                )}
                                                onClick={() => {
                                                    if (carBtnRef.current) {
                                                        setCarBtnWidth(
                                                            carBtnRef.current.offsetWidth
                                                        );
                                                    }
                                                }}
                                            >
                                                {field.value
                                                    ? cars.find((car) => car.id === field.value)
                                                          ?.number
                                                    : 'Select car'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="p-0"
                                            style={{
                                                width: carBtnWidth > 0 ? carBtnWidth : 'auto',
                                            }}
                                        >
                                            {/* used command just for quick demo */}
                                            <Command>
                                                <CommandInput placeholder="Search car..." />
                                                <CommandEmpty>No car found.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="none"
                                                        onSelect={() => {
                                                            setValue('carId', undefined);
                                                            setCarOpen(false);
                                                        }}
                                                    >
                                                        <span className="text-muted-foreground">
                                                            No car selected
                                                        </span>
                                                    </CommandItem>
                                                    {cars.map((car) => (
                                                        <CommandItem
                                                            value={car.number}
                                                            key={car.id}
                                                            onSelect={() => {
                                                                setValue('carId', car.id);
                                                                setCarOpen(false);
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <span>{car.number}</span>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2"
                                                                >
                                                                    {car.model}
                                                                </Badge>
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FieldGroup>
                                {errors.carId && <FieldError>{errors.carId.message}</FieldError>}
                            </Field>
                        )}
                    />

                    {/* Note*/}
                    <Controller
                        control={control}
                        name="note"
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>Note (Optional)</FieldLabel>
                                <FieldGroup>
                                    <Textarea
                                        placeholder="Additional notes about this expense..."
                                        className="max-h-[100px] resize-y"
                                        {...field}
                                    />
                                </FieldGroup>
                                {errors.note && <FieldError>{errors.note.message}</FieldError>}
                            </Field>
                        )}
                    />

                    <DialogFooter>
                        <Button type="submit">Save Expense</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default NewExpenseDialog;
