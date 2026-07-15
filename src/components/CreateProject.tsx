import { useAppSelector } from "@/redux/hooks"
import { selectProject, setPreviewProject } from "@/redux/slices/projectSlice"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FileText,
  DollarSign,
  Upload,
  Link2,
  Paperclip,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  LayoutGrid,
} from "lucide-react";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import MediaUpload from "./MediaUpload";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateProjectMutation,
  useGetProjectCategoriesQuery,
  useGetProjectTypesQuery,
  useGetProvincesQuery,
  useGetTerritoriesQuery,
} from "@/redux/services/projectServices";
import { selectUser } from "@/redux/slices/userSlice";
import LoadingComponent from "./LoadingComponent";
import toast from "react-hot-toast";
import PreviewProject from "./PreviewProject";
import axios from 'axios';
import { apiUrl } from "@/lib/env";
import { useGetUserCanvasesQuery } from "@/redux/services/bmcServices";
import { useGetUserBusinessPlansQuery } from "@/redux/services/businessPlanServices";


function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formSchema = z.object({
  name: z.string().min(3, "Project name is required"),
  type: z.string(),
  category: z.string(),
  description: z.string().min(3, "Description is required"),
  province: z.string().min(3, "Province is required"),
  territory: z.string().min(3, "Territory is required"),
  currency: z.enum(["USD", "EUR", "CDF"]),
  targetAmount: z.coerce.number().min(1, "Target amount is required"),
  projectOwner: z.string().min(1, "Project owner ID is required").optional(),
  medias: z.array(z.instanceof(File)).optional(),
  attachments: z.array(z.instanceof(File)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Province {
  _id: string;
  name: string;
  status: string;
}

interface Territory {
  _id: string;
  name: string;
  status: string;
  province?: { _id: string; name: string };
}

function CreateProject() {
  const _project = useAppSelector(selectProject)
  const navigate = useNavigate()
  const [date, setDate] = useState<Date>(new Date());
  const [upload, setUpload] = useState(true)
  const [embededLink, setEmbededLink] = useState(false)
  const [unsplash, setUnsplash] = useState(false)
  const user = useAppSelector(selectUser)
  const [uploadedMedias, setUploadedMdias] = useState<File[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<File[]>([]);
  const [preview, setPreview] = useState(false)
  const [next, setNext] = useState(true)
  const formattedDate = formatDate(date);

  // Existing documents for smart attachments
  const { data: bmcCanvases } = useGetUserCanvasesQuery();
  const { data: userBusinessPlans, isError: bpError } = useGetUserBusinessPlansQuery(
    { userId: user._id },
    { skip: !user._id }
  );
  const businessPlans: any[] = (userBusinessPlans as any)?.businessPlans
    || (userBusinessPlans as any)?.data
    || (Array.isArray(userBusinessPlans) ? userBusinessPlans : []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      category: "",
      province: "",
      territory: "",
      currency: "USD",
    },
  });

  const handleMediasChange = (files: File[]) => {
    setValue("medias", files);
    setUploadedMdias(files);
  };

  const handleAttachmentsChange = (files: File[]) => {
    setValue("attachments", files);
    setUploadedAttachments(files);
  };

  const [
    CreateProjectMutation,
    {
      data: createProjectData,
      error: createProjectError,
      isSuccess: createProjectIsSuccess,
      isError: createProjectIsError,
      isLoading: createProjectIsLoading,
    },
  ] = useCreateProjectMutation();

  const { data: getProvincesData, isLoading: getProvincesIsLoading } = useGetProvincesQuery(undefined);
  const { data: getTerritoriesData, isLoading: getTerritoriesIsLoading } = useGetTerritoriesQuery(undefined);
  const { data: projectCategoriesData, isLoading: projectCategoriesIsLoading } = useGetProjectCategoriesQuery(undefined);
  const { data: projectTypesData, isLoading: projectTypesIsLoading } = useGetProjectTypesQuery(undefined);

  // ── Data normalization helpers ──────────────────────────────────────────────

  const validateCategoryData = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      if (!item || typeof item !== 'object') return null;
      const name = item.name || item.title || item.label || item.categoryName || "Unknown Category";
      return { _id: item._id || item.id || `id-${Math.random()}`, name, status: item.status || "ENABLED" };
    }).filter(Boolean);
  };

  const validateTypeData = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    return data.map(item => {
      if (!item || typeof item !== 'object') return null;
      const name = item.name || item.title || item.label || item.typeName || "Unknown Type";
      return { _id: item._id || item.id || `id-${Math.random()}`, name, status: item.status || "ENABLED" };
    }).filter(Boolean);
  };

  const validateProvinceData = (data: any): Province[] => {
    if (!data) return [];
    let arr = data;
    if (!Array.isArray(arr)) {
      if (typeof arr === 'string') {
        try { arr = JSON.parse(arr); } catch { return []; }
        if (!Array.isArray(arr)) return [];
      } else {
        return [];
      }
    }
    return arr.map((item: any) => {
      if (!item) return { _id: `ph-${Math.random()}`, name: "Unknown Province", status: "ENABLED" };
      return {
        _id: item._id || item.id || `p-${Math.random()}`,
        name: item.name || item.title || item.label || "Unknown Province",
        status: item.status || "ENABLED",
      };
    });
  };

  const validateTerritoryData = (data: any): Territory[] => {
    if (!data) return [];
    let arr = data;
    if (!Array.isArray(arr)) {
      if (typeof arr === 'string') {
        try { arr = JSON.parse(arr); } catch { return []; }
        if (!Array.isArray(arr)) return [];
      } else {
        return [];
      }
    }
    return arr.map((item: any) => {
      if (!item) return { _id: `th-${Math.random()}`, name: "Unknown Territory", status: "ENABLED" };
      return {
        _id: item._id || item.id || `t-${Math.random()}`,
        name: item.name || item.title || item.label || "Unknown Territory",
        status: item.status || "ENABLED",
        province: item.province ? { _id: item.province._id || "", name: item.province.name || "" } : undefined,
      };
    });
  };

  const normalizedCategories = projectCategoriesData ? validateCategoryData(projectCategoriesData) : [];
  const normalizedTypes = projectTypesData ? validateTypeData(projectTypesData) : [];

  // ── Fallback static data ────────────────────────────────────────────────────

  const fallbackProvinces: Province[] = [
    { _id: "fb-1", name: "Nord-Kivu", status: "ENABLED" },
    { _id: "fb-2", name: "Kinshasa", status: "ENABLED" },
    { _id: "fb-3", name: "Sud-Kivu", status: "ENABLED" },
  ];

  const fallbackTerritories: Territory[] = [
    { _id: "ft-1", name: "Goma", status: "ENABLED", province: { _id: "fb-1", name: "Nord-Kivu" } },
    { _id: "ft-2", name: "Beni", status: "ENABLED", province: { _id: "fb-1", name: "Nord-Kivu" } },
    { _id: "ft-3", name: "Bukavu", status: "ENABLED", province: { _id: "fb-3", name: "Sud-Kivu" } },
  ];

  // ── Direct API fetch (bypasses RTK cache for province/territory) ──────────

  const [directProvinces, setDirectProvinces] = useState<Province[]>([]);
  const [directTerritories, setDirectTerritories] = useState<Territory[]>([]);
  const [directFetchLoading, setDirectFetchLoading] = useState(true);

  useEffect(() => {
    const fetchDirectData = async () => {
      setDirectFetchLoading(true);
      try {
        const [pRes, tRes] = await Promise.all([
          axios.get(`${apiUrl}provinces`),
          axios.get(`${apiUrl}territories`),
        ]);
        if (Array.isArray(pRes.data) && pRes.data.length > 0) setDirectProvinces(pRes.data);
        if (Array.isArray(tRes.data) && tRes.data.length > 0) setDirectTerritories(tRes.data);
      } catch {
        // silently fall back to RTK / static data
      } finally {
        setDirectFetchLoading(false);
      }
    };
    fetchDirectData();
  }, []);

  // ── Province / territory helpers ────────────────────────────────────────────

  const getProvincesList = (): Province[] => {
    if (!directFetchLoading && directProvinces.length > 0) return directProvinces;
    if (!getProvincesIsLoading && getProvincesData && Array.isArray(getProvincesData) && getProvincesData.length > 0)
      return validateProvinceData(getProvincesData);
    return fallbackProvinces;
  };

  const getTerritoriesList = (): Territory[] => {
    if (!directFetchLoading && directTerritories.length > 0) return directTerritories;
    if (!getTerritoriesIsLoading && getTerritoriesData && Array.isArray(getTerritoriesData) && getTerritoriesData.length > 0)
      return validateTerritoryData(getTerritoriesData);
    return fallbackTerritories;
  };

  const [filteredTerritories, setFilteredTerritories] = useState<Territory[]>([]);

  const getFilteredTerritoriesList = (): Territory[] =>
    filteredTerritories.length > 0 ? filteredTerritories : getTerritoriesList();

  // Default province/territory once data loads
  useEffect(() => {
    const provinces = getProvincesList();
    const territories = getTerritoriesList();
    if (provinces.length > 0 && !watch("province")) setValue("province", provinces[0].name);
    if (territories.length > 0 && !watch("territory")) setValue("territory", territories[0].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directProvinces, directTerritories, getProvincesData, getTerritoriesData]);

  // ── Select change handlers ──────────────────────────────────────────────────

  const handleCategoryChange = (value: string) => setValue("category", value);
  const handleTypeChange = (value: string) => setValue("type", value);
  const handleTerritoryChange = (value: string) => setValue("territory", value);

  const handleProvinceChange = (value: string) => {
    setValue("province", value);
    setValue("territory", "");
    const allProvinces = getProvincesList();
    const selected = allProvinces.find(p => p.name === value);
    if (selected) {
      const allTerritories = directTerritories.length > 0 ? directTerritories : getTerritoriesList();
      const filtered = allTerritories.filter(
        (t: Territory) => t.province && (t.province._id === selected._id || t.province.name === selected.name)
      );
      setFilteredTerritories(filtered);
      if (filtered.length > 0) setValue("territory", filtered[0].name);
    } else {
      setFilteredTerritories([]);
    }
  };

  // ── Form submission ─────────────────────────────────────────────────────────

  const [allValues, setAllValues] = useState<FormValues>(() => getValues());

  const onsubmit = async (data: FormValues) => {
    if (!preview) {
      setAllValues(getValues());
      setPreview(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("province", data.province);
    formData.append("territory", data.territory);
    formData.append("endDate", formattedDate);
    formData.append("currency", data.currency);
    formData.append("targetAmount", data.targetAmount?.toString());
    formData.append("projectOwner", user._id);
    uploadedMedias.forEach(file => formData.append("medias", file));
    uploadedAttachments.forEach(file => formData.append("attachments", file));

    try {
      await CreateProjectMutation(formData).unwrap();
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch {
      toast.error("Failed to create project!");
    }
  };

  useEffect(() => {
    if (createProjectData && createProjectIsSuccess) {
      reset();
      setPreviewProject(false);
      navigate("/projects");
    }
    if (createProjectIsError) {
      toast.error("Cannot create project");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProjectIsError, createProjectIsSuccess]);

  // ── Render ──────────────────────────────────────────────────────────────────

  const hasSmartDocs =
    (bmcCanvases && bmcCanvases.length > 0) ||
    (!bpError && businessPlans.length > 0);

  const mediaTabItems = [
    { key: 'upload', label: 'Upload', icon: Upload },
    { key: 'link', label: 'Embed Link', icon: Link2 },
    { key: 'unsplash', label: 'Unsplash', icon: ImageIcon },
  ] as const;

  return (
    <>
      {preview && (
        <PreviewProject
          data={allValues}
          back={() => setPreview(false)}
          loading={createProjectIsLoading}
          submit={handleSubmit(onsubmit)}
        />
      )}

      {!preview && (
        <div className="min-h-screen bg-gray-50">

          {/* ── Sticky Header ── */}
          <header className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between gap-4">

              {/* Back + Title */}
              <div className="flex items-center gap-4 min-w-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                    <span>Projects</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-700 font-medium truncate">New Project</span>
                  </div>
                  <h1 className="text-lg font-bold text-gray-900 truncate">Create a New Project</h1>
                </div>
              </div>

              {/* Step Indicator (desktop) */}
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  next
                    ? "bg-[rgb(3,10,61)] text-white"
                    : "bg-green-50 text-green-700 border border-green-200"
                )}>
                  {next ? (
                    <span className="w-5 h-5 rounded-full bg-white text-[rgb(3,10,61)] text-xs font-bold flex items-center justify-center">1</span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  Project Info
                </div>

                <div className="w-8 h-px bg-gray-200" />

                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  !next
                    ? "bg-[rgb(3,10,61)] text-white"
                    : "bg-gray-100 text-gray-400"
                )}>
                  <span className={cn(
                    "w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center",
                    !next ? "bg-white text-[rgb(3,10,61)]" : "bg-gray-300 text-gray-500"
                  )}>2</span>
                  Media & Docs
                </div>
              </div>

              {/* Header Action Buttons (desktop) */}
              <div className="hidden md:flex items-center gap-3 shrink-0">
                {next ? (
                  <Button
                    type="button"
                    onClick={() => setNext(false)}
                    className="bg-[rgb(3,10,61)] hover:bg-blue-900 text-white rounded-xl px-5 h-10 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNext(true)}
                      className="rounded-xl px-5 h-10"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit(onsubmit)}
                      className="bg-[rgb(3,10,61)] hover:bg-blue-900 text-white rounded-xl px-5 h-10 flex items-center gap-2"
                    >
                      Preview Project
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ── Form Body ── */}
          <form className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* ════ LEFT COLUMN — Project Details ════ */}
              <div className="space-y-6">

                {/* Card: Project Information */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Project Information</h2>
                  </div>

                  {/* Project Name */}
                  <div className="space-y-1.5 mb-5">
                    <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
                      Project Name <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      {...register("name")}
                      rows={2}
                      placeholder="e.g. Support 230 children to get school fees"
                      id="project-name"
                      className="resize-none rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 text-sm"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  {/* Category + Type */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      {projectCategoriesIsLoading ? (
                        <div className="h-10 flex items-center pl-2"><LoadingComponent /></div>
                      ) : (
                        <Select onValueChange={handleCategoryChange}>
                          <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Category</SelectLabel>
                              {normalizedCategories.map((item: any) => (
                                <SelectItem
                                  key={item._id}
                                  value={item.name}
                                  disabled={item.status !== "ENABLED"}
                                  className={item.status !== "ENABLED" ? "opacity-50" : ""}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      {projectTypesIsLoading ? (
                        <div className="h-10 flex items-center pl-2"><LoadingComponent /></div>
                      ) : (
                        <Select onValueChange={handleTypeChange}>
                          <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Type</SelectLabel>
                              {normalizedTypes.map((item: any) => (
                                <SelectItem
                                  key={item._id}
                                  value={item.name}
                                  disabled={item.status !== "ENABLED"}
                                  className={item.status !== "ENABLED" ? "opacity-50" : ""}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="project-description" className="text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      {...register("description")}
                      rows={4}
                      placeholder="Describe your project goals, impact, and how funds will be used…"
                      id="project-description"
                      className="resize-none rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 text-sm"
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                  </div>
                </div>

                {/* Card: Location & Funding */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Location & Funding</h2>
                  </div>

                  {/* Province + Territory */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Province</label>
                      <Select onValueChange={handleProvinceChange}>
                        <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm">
                          <SelectValue placeholder={getProvincesIsLoading ? "Loading…" : "Select province"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Province</SelectLabel>
                            {getProvincesList().map((item: Province) => (
                              <SelectItem key={item._id} value={item.name}>{item.name}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.province && <p className="text-xs text-red-500">{errors.province.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Territory</label>
                      <Select onValueChange={handleTerritoryChange}>
                        <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm">
                          <SelectValue placeholder={getTerritoriesIsLoading ? "Loading…" : "Select territory"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Territory</SelectLabel>
                            {getFilteredTerritoriesList().map((item: Territory) => (
                              <SelectItem key={item._id} value={item.name}>
                                {item.name}{item.province ? ` (${item.province.name})` : ''}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.territory && <p className="text-xs text-red-500">{errors.territory.message}</p>}
                    </div>
                  </div>

                  {/* Currency + Target Amount */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Currency</label>
                      <Select
                        defaultValue="USD"
                        onValueChange={(v) => setValue("currency", v as "USD" | "EUR" | "CDF")}
                      >
                        <SelectTrigger className="h-10 rounded-xl border-gray-200 text-sm">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Currency</SelectLabel>
                            <SelectItem value="USD">USD — US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR — Euro</SelectItem>
                            <SelectItem value="CDF">CDF — Franc Congolais</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Target Amount <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("targetAmount")}
                        type="number"
                        placeholder="e.g. 5000"
                        className="h-10 rounded-xl border-gray-200 text-sm"
                      />
                      {errors.targetAmount && <p className="text-xs text-red-500">{errors.targetAmount.message}</p>}
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Project End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className={cn(
                            "w-full h-10 justify-start text-left font-normal rounded-xl border-gray-200 text-sm",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                        <Select onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}>
                          <SelectTrigger className="h-9 rounded-lg text-sm">
                            <SelectValue placeholder="Quick select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Today</SelectItem>
                            <SelectItem value="1">Tomorrow</SelectItem>
                            <SelectItem value="3">In 3 days</SelectItem>
                            <SelectItem value="7">In a week</SelectItem>
                            <SelectItem value="30">In a month</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => d && setDate(d)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Mobile: Continue Button */}
                {next && (
                  <Button
                    type="button"
                    onClick={() => setNext(false)}
                    className="lg:hidden w-full h-12 bg-[rgb(3,10,61)] hover:bg-blue-900 text-white font-semibold rounded-xl"
                  >
                    Continue to Media & Docs
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* ════ RIGHT COLUMN — Media & Attachments ════ */}
              <div className="space-y-6">

                {/* Card: Project Media */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Project Media</h2>
                  </div>

                  {/* Tab Bar */}
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl mb-5">
                    {mediaTabItems.map(({ key, label, icon: Icon }) => {
                      const active = (key === 'upload' && upload) || (key === 'link' && embededLink) || (key === 'unsplash' && unsplash);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setUpload(key === 'upload');
                            setEmbededLink(key === 'link');
                            setUnsplash(key === 'unsplash');
                          }}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all",
                            active
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content */}
                  {upload && (
                    <MediaUpload accept="image/*" isDisabled={next} onFilesChange={handleMediasChange} />
                  )}
                  {embededLink && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Media URL</label>
                      <Input
                        placeholder="https://youtube.com/…"
                        className="h-10 rounded-xl border-gray-200 text-sm"
                        disabled={next}
                      />
                    </div>
                  )}
                  {unsplash && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search Unsplash…"
                          className="h-10 rounded-xl border-gray-200 text-sm flex-1"
                          disabled={next}
                        />
                        <Button
                          type="button"
                          disabled={next}
                          className="h-10 px-4 bg-[rgb(3,10,61)] text-white rounded-xl text-sm"
                        >
                          Search
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                      </div>
                    </div>
                  )}

                  {next && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Complete project info and click <strong className="mx-0.5">Continue</strong> to enable media uploads.
                    </div>
                  )}
                </div>

                {/* Card: Attachments */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-orange-500" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900">Attachments</h2>
                  </div>
                  <p className="text-xs text-gray-400 mb-5 pl-11">
                    Attach supporting PDFs to strengthen your project's credibility with funders.
                  </p>

                  {/* ── Smart Documents ── */}
                  {hasSmartDocs && (
                    <div className="mb-5">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                        Your Existing Documents
                      </p>
                      <div className="space-y-2.5">

                        {/* BMC Canvases */}
                        {bmcCanvases && bmcCanvases.slice(0, 2).map(canvas => (
                          <div
                            key={canvas._id}
                            className="group flex items-center gap-3 p-3.5 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 hover:border-blue-200 transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                              <LayoutGrid className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {canvas.title || 'Business Model Canvas'}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1">
                                  {canvas.status === 'completed'
                                    ? <><CheckCircle2 className="w-3 h-3 text-green-500" /> Completed</>
                                    : <>In progress</>
                                  }
                                </span>
                                <span>·</span>
                                <span>BMC</span>
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate('/bmc')}
                              className="text-blue-500 hover:text-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                              title="Open in BMC section"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Business Plans */}
                        {!bpError && businessPlans.slice(0, 2).map((plan: any) => (
                          <div
                            key={plan._id}
                            className="group flex items-center gap-3 p-3.5 rounded-xl border border-green-100 bg-gradient-to-r from-green-50/60 to-emerald-50/40 hover:border-green-200 transition-all"
                          >
                            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {plan.metadata?.title || plan.title || 'Business Plan'}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                                Business Plan · {plan.metadata?.status || plan.status || 'draft'}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigate('/business-plan')}
                              className="text-green-500 hover:text-green-700 transition-colors opacity-0 group-hover:opacity-100"
                              title="Open in Business Plan section"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                        Export these as PDF from their sections, then upload them below.
                      </p>

                      {/* Divider */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-xs text-gray-300 shrink-0">or upload PDF directly</span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>
                    </div>
                  )}

                  {/* Manual Upload */}
                  <MediaUpload
                    accept="application/pdf"
                    isDisabled={next}
                    onFilesChange={handleAttachmentsChange}
                  />

                  {next && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Complete project info and click <strong className="mx-0.5">Continue</strong> to enable uploads.
                    </div>
                  )}
                </div>

                {/* Mobile: Preview Button */}
                {!next && (
                  <Button
                    type="button"
                    onClick={handleSubmit(onsubmit)}
                    className="lg:hidden w-full h-12 bg-[rgb(3,10,61)] hover:bg-blue-900 text-white font-semibold rounded-xl"
                  >
                    Preview Project
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateProject;
