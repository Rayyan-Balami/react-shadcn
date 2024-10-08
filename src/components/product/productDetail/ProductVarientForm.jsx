import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, Wallet, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "@/store/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

function ProductVarientForm({
  allProducts,
  product,
  selectedVarient,
  setSelectedVarient,
}) {
  console.log("new product selected", selectedVarient);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      color: selectedVarient.color,
      size: selectedVarient.size[0],
      quantity: 1,
    },
  });

  const sizes = selectedVarient.size;
  const colors = product.skus.map((sku) => sku.color);

  useEffect(() => {
    form.reset({
      color: selectedVarient.color,
      size: selectedVarient.size[0],
      quantity: 1,
    });
  }, [selectedVarient, form]);

  useEffect(() => {
    const currentColor = form.watch("color");
    const selectedSku = product.skus.find((sku) => sku.color === currentColor);
    if (selectedSku) {
      setSelectedVarient(selectedSku);
      form.setValue("size", selectedSku.size[0]);
    }
  }, [form.watch("color"), product.skus, setSelectedVarient]);

  const handleBuyNow = (e) => {
    e.preventDefault();
    const size = form.getValues("size");
    const quantity = form.getValues("quantity");

    if (!selectedVarient || !size) {
      toast.error("Please select a variant and size.");
      return;
    }

    const item = {
      id: product.$id,
      quantity,
      sku: { ...selectedVarient, size },
      imagePreview: product.imagePreviews[0],
      name: product.name,
    };
    localStorage.setItem("buyNow", JSON.stringify(item));
    navigate("/checkout/buy-now");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const size = form.getValues("size");
    const quantity = form.getValues("quantity");

    if (!selectedVarient || !size) {
      toast.error("Please select a variant and size.");
      return;
    }

    console.log("sku", { ...selectedVarient, size });

    dispatch(
      addToCart({
        item: {
          id: product.$id,
          quantity,
          sku: { ...selectedVarient, size },
          isChecked: false,
        },
        products: allProducts,
      })
    );
    toast.success("Added to cart");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          return new Promise((resolve) => setTimeout(resolve, 1000)).then(
            () => {
              console.log(data);
              form.reset();
            }
          );
        })}
        className="grid gap-6"
      >
        {/* Color Options */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="justify-start flex-wrap gap-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {colors.map((color) => (
                    <ToggleGroupItem
                      key={color}
                      value={color}
                      aria-label={color}
                      className={`px-3 py-1 transition-colors duration-300 cursor-pointer capitalize ${
                        field.value === color
                          ? "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {color}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Size Options */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  className="justify-start flex-wrap gap-2"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {sizes.map((size) => (
                    <ToggleGroupItem
                      key={size}
                      value={size}
                      aria-label={size}
                      className={`px-3 py-1 transition-colors duration-300 cursor-pointer uppercase ${
                        field.value === size
                          ? "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Quantity Options */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="p-1"
                    disabled={field.value <= 1}
                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max={selectedVarient.stock}
                      value={field.value}
                      onChange={(e) => {
                        const parsedValue = parseInt(e.target.value, 10);
                        const validValue =
                          isNaN(parsedValue) || parsedValue < 1
                            ? 1
                            : Math.min(parsedValue, selectedVarient.stock);
                        field.onChange(validValue);
                      }}
                      className="text-center"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="p-1"
                    disabled={field.value >= selectedVarient.stock}
                    onClick={() => field.onChange(field.value + 1)}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </div>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />

          {/* Buy Now and Add to Cart Buttons */}
          {selectedVarient.stock < 100 && (
            <Badge
              variant="secondary"
              className="mt-auto h-10 justify-center rounded-md text-sm gap-2 py-1"
            >
              <Package className="size-[1.15rem]" />
              {selectedVarient.stock === 0 ? "Out of Stock" : "Low Stock"}
            </Badge>
          )}
          <Button
            type="button"
            className="w-full flex items-center gap-2"
            disabled={selectedVarient.stock === 0}
            onClick={handleBuyNow}
          >
            <Wallet className="size-4" />
            Buy Now
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProductVarientForm;
