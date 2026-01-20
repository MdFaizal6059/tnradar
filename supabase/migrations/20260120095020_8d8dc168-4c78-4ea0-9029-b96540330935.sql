-- Create the favorite_locations table
CREATE TABLE public.favorite_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    city TEXT NOT NULL,
    locality TEXT,
    country TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, lat, lon)
);

-- Enable Row Level Security
ALTER TABLE public.favorite_locations ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check ownership
CREATE OR REPLACE FUNCTION public.is_owner(record_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT auth.uid() = record_user_id
$$;

-- RLS Policies for favorite_locations
-- Users can view their own favorite locations
CREATE POLICY "Users can view their own favorite locations"
ON public.favorite_locations
FOR SELECT
TO authenticated
USING (public.is_owner(user_id));

-- Users can insert their own favorite locations
CREATE POLICY "Users can insert their own favorite locations"
ON public.favorite_locations
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(user_id));

-- Users can update their own favorite locations
CREATE POLICY "Users can update their own favorite locations"
ON public.favorite_locations
FOR UPDATE
TO authenticated
USING (public.is_owner(user_id));

-- Users can delete their own favorite locations
CREATE POLICY "Users can delete their own favorite locations"
ON public.favorite_locations
FOR DELETE
TO authenticated
USING (public.is_owner(user_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_favorite_locations_updated_at
BEFORE UPDATE ON public.favorite_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();