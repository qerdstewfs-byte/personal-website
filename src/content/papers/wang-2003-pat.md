---
{
  "slug": "wang-2003-pat",
  "title": "Noninvasive laser-induced photoacoustic tomography for structural and functional in vivo imaging of the brain",
  "category": "pact",
  "status": "published",
  "summary": "Wang et al. demonstrate structural and functional photoacoustic imaging of the rat brain through skin and skull, using intrinsic absorption contrast and a scanning ultrasound detector.",
  "journal": "Nature Biotechnology",
  "year": 2003,
  "authors": [
    "Xueding Wang",
    "Yongjiang Pang",
    "Geng Ku",
    "Xueyi Xie",
    "George Stoica",
    "Lihong V. Wang"
  ],
  "doi": "10.1038/nbt839",
  "tags": [
    "Brain imaging",
    "Functional PAT",
    "Circular scanning",
    "Hemodynamics"
  ],
  "downloads": {
    "pdf": {
      "url": "/library/wang-2003-pat/original.pdf",
      "label": "Wang-2003-Original.pdf",
      "size": "956 KB"
    },
    "notes": {
      "url": "/library/wang-2003-pat/reading-notes.pdf",
      "label": "Wang-2003-Reading-Notes.pdf",
      "size": "1.95 MB"
    }
  },
  "team": {
    "name": "Optical Imaging Laboratory and Department of Pathobiology",
    "institution": "Texas A&M University (affiliations at publication, 2003)",
    "mainWork": [
      "The 2003 team developed noninvasive structural and functional photoacoustic imaging of the rat brain. Xueding Wang is first author and Lihong V. Wang is corresponding author.",
      "Lihong V. Wang’s later Caltech laboratory studies photoacoustic and thermoacoustic tomography, compressed ultrafast photography, quantum imaging and time reversal. Xueding Wang’s Michigan laboratory works on biomedical imaging and therapy involving light and ultrasound. These are later research directions, separate from the paper’s 2003 affiliations."
    ],
    "sources": [
      {
        "title": "Wang et al. (2003). Nature Biotechnology 21, 803–806. DOI: 10.1038/nbt839",
        "url": "https://www.nature.com/articles/nbt839"
      },
      {
        "title": "Caltech Optical Imaging Laboratory · Research",
        "url": "https://coilab.caltech.edu/research"
      },
      {
        "title": "University of Michigan · Xueding Wang",
        "url": "https://bme.umich.edu/people/wang-xueding/"
      },
      {
        "title": "Caltech · Lihong Wang’s contributions to biomedical optics",
        "url": "https://mede.caltech.edu/news/lihong-wang-honored-with-a-special-issue-of-the-journal-of-biomedical-optics"
      }
    ]
  },
  "problem": "Blood absorbs light strongly. But light scatters inside tissue, making it difficult to locate an absorber from the light that returns to the surface. The researchers wanted an image of the brain beneath its coverings. Opening the skull gives direct optical access but changes the experimental preparation. PAT uses the absorbed light to generate a brief pressure wave, then estimates its origin from ultrasound measurements.",
  "materials": [
    {
      "title": "Subjects and sources of contrast",
      "text": "Research subject: Adult Sprague-Dawley rats, approximately 350 g, imaged under anesthesia. The authors report average skin and skull thicknesses of about 0.6 mm and 0.8 mm.\n\nSource of contrast: The study uses endogenous tissue absorption, with strong vascular contrast from hemoglobin. It does not rely on an injected contrast agent.\n\nIllumination and reception: Incident fluence was below 10 mJ/cm², with an estimated skin temperature rise below 20 mK. The detector had 88% bandwidth at −6 dB and a cylindrical focal diameter of about 1 mm.\n\nReference measurements: A tissue-equivalent phantom supplied the line-spread function for resolution assessment. Post-imaging photographs and cortical histology checked anatomical localization.",
      "figureIds": []
    }
  ],
  "methods": [
    {
      "title": "System and acquisition",
      "text": "A single detector travels around the head while the laser illuminates a broad region. A mirror redirects the beam. A concave lens expands it and ground glass makes the illumination more uniform. Water couples sound into the V383 transducer. The 500 PR amplifier raises the electrical signal before a digital oscilloscope records each waveform.",
      "figureIds": [
        "fig-1"
      ]
    },
    {
      "title": "Tomographic reconstruction",
      "text": "The experiment records a waveform at each known detector position. The image grid supplies candidate source locations; reconstruction estimates absorption at each location. Choose the field of view and the candidate pixel coordinates. Use each pixel’s distance to the detector and the assumed sound speed. At that arrival time, sample the time derivative with the weighting in Eq. 1. Sum contributions over the circular scan, then repeat for every pixel.",
      "figureIds": []
    }
  ],
  "innovations": [
    {
      "title": "Structural imaging through skin and skull",
      "before": "Pure optical transcranial localization is limited by strong tissue scattering.",
      "change": "Combine broad optical illumination with full-view acoustic detection and tomographic reconstruction.",
      "why": "Optical absorption generates pressure waves whose travel times constrain the location of the source.",
      "evidence": "Figure 2 shows correspondence with post-imaging anatomy. The reported vessel-to-background contrast is 2.3–7.9 and in-plane resolution approximately 0.2 mm.",
      "tradeoff": "Single-detector scanning takes approximately 16 minutes per image. Finite bandwidth and illumination conditions constrain interpretation.",
      "figureIds": [
        "fig-2"
      ]
    },
    {
      "title": "Stimulus-related functional mapping",
      "before": "A static absorption image does not isolate a physiological change caused by stimulation.",
      "change": "Subtract resting-state PAT from left- or right-whisker stimulation images and register responses to anatomy.",
      "why": "Difference maps emphasize absorption changes associated with vascular responses.",
      "evidence": "Figure 4 shows contralateral responses and anatomical/histological agreement, with up to 8% fractional absorption change in large vessels.",
      "tradeoff": "This is an indirect hemodynamic measure. The single wavelength does not quantify oxygen saturation, and vascular spread limits specificity to the neuronal source.",
      "figureIds": [
        "fig-4"
      ]
    }
  ],
  "results": [
    {
      "title": "Lesion localization",
      "text": "The PAT image places the superficial lesion in the right cortex. The subsequent photograph provides an anatomical check of its position and shape. A needle created the lesion through the skin and skull. The imaging readout required no open window, but lesion induction was invasive. This experiment does not establish disease-specific diagnosis.",
      "figureIds": [
        "fig-3"
      ]
    },
    {
      "title": "Resolution and acquisition",
      "text": "Approximately 0.2 mm in-plane resolution from a phantom line-spread function. A 1.5° full-circle scan with about four seconds per position takes approximately 16 minutes.",
      "figureIds": []
    }
  ],
  "conclusions": [
    "The contribution is an integrated in vivo demonstration of structural and functional brain PAT through the skin and skull.",
    "Normal anatomy and an induced superficial lesion appear with intrinsic absorption contrast and agree with post-imaging photographs.",
    "Stimulus-versus-rest comparisons reveal lateralized vascular changes. Anatomy and histology support their spatial interpretation.",
    "Broad optical excitation, full-view acoustic acquisition and reconstruction connect optical absorption to a spatial map. The work establishes a path toward functional PACT.",
    "The demonstrated system is slow, uses one wavelength and measures a hemodynamic proxy. Real-time imaging and human brain imaging remain future directions in this paper."
  ],
  "figures": [
    {
      "id": "fig-1",
      "src": "/library/wang-2003-pat/fig-1.webp",
      "width": 992,
      "height": 644,
      "alt": "Laser, water-coupled scanning transducer, amplifier, oscilloscope and computer.",
      "caption": "Light delivery on the right; acoustic detection and electrical readout on the left.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 1.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-2",
      "src": "/library/wang-2003-pat/fig-2.webp",
      "width": 1004,
      "height": 544,
      "alt": "Rat brain photoacoustic image beside the post-imaging open-skull photograph.",
      "caption": "a: PAT through skin and skull. b: Anatomical reference acquired afterwards.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 2.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-3",
      "src": "/library/wang-2003-pat/fig-3.webp",
      "width": 996,
      "height": 532,
      "alt": "Photoacoustic localization of an induced cortical lesion compared with a photograph.",
      "caption": "The marked lesion in a corresponds to the outlined region in b.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 3.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4",
      "src": "/library/wang-2003-pat/fig-4.webp",
      "width": 976,
      "height": 1100,
      "alt": "Baseline vascular image, left and right stimulation maps, anatomical photograph and barrel cortex histology.",
      "caption": "Structural, functional and anatomical evidence in the original panel layout.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 4.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4a",
      "src": "/library/wang-2003-pat/fig-4a.webp",
      "width": 492,
      "height": 528,
      "alt": "Baseline photoacoustic image of superficial cortical blood vessels over a 2 by 2 cm field.",
      "caption": "Cortical vessels imaged through skin and skull.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 4a, cropped.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4b",
      "src": "/library/wang-2003-pat/fig-4b.webp",
      "width": 464,
      "height": 528,
      "alt": "Differential absorption overlaid on cortical vessels during left-side whisker stimulation.",
      "caption": "Left whisker stimulation: the response appears in the contralateral hemisphere.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 4b, cropped.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4c",
      "src": "/library/wang-2003-pat/fig-4c.webp",
      "width": 492,
      "height": 540,
      "alt": "Differential absorption overlaid on cortical vessels during right-side whisker stimulation.",
      "caption": "Right whisker stimulation: the response changes sides.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 4c, cropped.",
      "source": "https://www.nature.com/articles/nbt839"
    },
    {
      "id": "fig-4de",
      "src": "/library/wang-2003-pat/fig-4de.webp",
      "width": 408,
      "height": 556,
      "alt": "Anatomical photograph with activated regions and layer IV barrel cortex histology.",
      "caption": "d: Anatomical locations. e: Barrel cortex histology used to check localization.",
      "attribution": "Wang et al., 2003, Nature Biotechnology, Fig. 4d–e, cropped.",
      "source": "https://www.nature.com/articles/nbt839"
    }
  ],
  "references": [
    {
      "title": "Wang et al. (2003). Nature Biotechnology 21, 803–806. DOI: 10.1038/nbt839",
      "url": "https://www.nature.com/articles/nbt839"
    },
    {
      "title": "Caltech Optical Imaging Laboratory · Research",
      "url": "https://coilab.caltech.edu/research"
    },
    {
      "title": "Caltech · Lihong Wang’s contributions to biomedical optics",
      "url": "https://mede.caltech.edu/news/lihong-wang-honored-with-a-special-issue-of-the-journal-of-biomedical-optics"
    },
    {
      "title": "University of Michigan · Xueding Wang",
      "url": "https://bme.umich.edu/people/wang-xueding/"
    },
    {
      "title": "Michigan Optical Imaging Laboratory · Research",
      "url": "https://opticimage.engin.umich.edu/research/"
    }
  ],
  "presentation": {
    "title": "Wang et al., 2003",
    "slides": [
      {
        "id": "overview",
        "section": "WANG ET AL. / 2003",
        "layout": "cover",
        "title": "Noninvasive brain photoacoustic tomography",
        "lead": "Can we locate brain vessels and their response to stimulation while keeping the skin and skull in place?",
        "figureIds": [
          "fig-4a"
        ],
        "metrics": [
          {
            "value": "≈0.2 mm",
            "label": "In-plane resolution"
          },
          {
            "value": "≈16 min",
            "label": "Acquisition per image"
          }
        ],
        "sourceNote": "Wang et al. (2003), pp. 803–805, Fig. 4a.",
        "sourcePage": 1
      },
      {
        "id": "publication-team",
        "section": "PUBLICATION & TEAM",
        "title": "The research team",
        "layout": "text",
        "lead": "Nature Biotechnology · Volume 21, Issue 7 · Pages 803–806 · Published online 15 June 2003",
        "points": [
          {
            "label": "Texas A&M University · 2003",
            "text": "The Optical Imaging Laboratory in Biomedical Engineering collaborated with Pathobiology. Xueding Wang is the first author; Lihong V. Wang is the corresponding author. Coauthors are Yongjiang Pang, Geng Ku, Xueyi Xie and George Stoica."
          },
          {
            "label": "The work in this paper",
            "text": "The team combined optical excitation, ultrasound detection and reconstruction to study rat brain structure and stimulus-related blood dynamics through the overlying skin and skull."
          },
          {
            "label": "Lihong V. Wang · Subsequent research",
            "text": "At Caltech, the laboratory develops photoacoustic and thermoacoustic imaging, compressed ultrafast photography, quantum imaging and time-reversal methods. Tissue light-transport modeling is also part of its research history."
          },
          {
            "label": "Xueding Wang · Subsequent research",
            "text": "His Michigan laboratory develops biomedical imaging and therapy using light and ultrasound, including clinical photoacoustic imaging, photo-mediated ultrasound therapy and radiation-induced acoustic imaging."
          }
        ],
        "sources": [
          {
            "title": "Caltech Optical Imaging Laboratory · Research",
            "url": "https://coilab.caltech.edu/research"
          },
          {
            "title": "University of Michigan · Xueding Wang",
            "url": "https://bme.umich.edu/people/wang-xueding/"
          }
        ],
        "sourceNote": "2003 affiliations: original p. 803. Later research: linked institutional sources.",
        "sourcePage": 1
      },
      {
        "id": "research-problem",
        "section": "RESEARCH PROBLEM",
        "title": "Optical contrast, acoustic localization",
        "layout": "text",
        "lead": "Blood absorbs light strongly. But light scatters inside tissue, making it difficult to locate an absorber from the light that returns to the surface.",
        "paragraphs": [
          "The researchers wanted an image of the brain beneath its coverings. Opening the skull gives direct optical access but changes the experimental preparation. PAT uses the absorbed light to generate a brief pressure wave, then estimates its origin from ultrasound measurements."
        ],
        "flow": [
          {
            "label": "Illuminate",
            "text": "A short laser pulse reaches tissue."
          },
          {
            "label": "Absorb",
            "text": "Local energy deposition produces a small, rapid temperature rise."
          },
          {
            "label": "Generate sound",
            "text": "Thermoelastic expansion launches pressure waves."
          },
          {
            "label": "Detect & reconstruct",
            "text": "Multiple acoustic views locate the absorbing structures."
          }
        ],
        "takeaway": "Photoacoustic tomography (PAT) combines optical absorption contrast with acoustic detection. This broad-illumination, tomographic configuration is classified here as photoacoustic computed tomography (PACT).",
        "sourceNote": "Original p. 803. Learning notes pp. 5–14, 78–79.",
        "sourcePage": 1
      },
      {
        "id": "system",
        "section": "SYSTEM & INSTRUMENTATION",
        "layout": "wide",
        "title": "The experimental system",
        "lead": "A single detector travels around the head while the laser illuminates a broad region.",
        "points": [
          {
            "label": "Optical path",
            "text": "A mirror redirects the beam. A concave lens expands it and ground glass makes the illumination more uniform."
          },
          {
            "label": "Acoustic and electrical path",
            "text": "Water couples sound into the V383 transducer. The 500 PR amplifier raises the electrical signal before a digital oscilloscope records each waveform."
          }
        ],
        "metrics": [
          {
            "value": "532 nm",
            "label": "Laser wavelength"
          },
          {
            "value": "6.5 ns",
            "label": "Pulse width at half maximum"
          },
          {
            "value": "3.5 MHz",
            "label": "Detector center frequency"
          }
        ],
        "figureIds": [
          "fig-1"
        ],
        "sourceNote": "Original p. 803, Fig. 1. Learning notes pp. 15–29.",
        "sourcePage": 2
      },
      {
        "id": "materials",
        "section": "MATERIALS & EXPERIMENTAL CONDITIONS",
        "layout": "text",
        "title": "Subjects, contrast and sampling",
        "points": [
          {
            "label": "Research subject",
            "text": "Adult Sprague-Dawley rats, approximately 350 g, imaged under anesthesia. The authors report average skin and skull thicknesses of about 0.6 mm and 0.8 mm."
          },
          {
            "label": "Source of contrast",
            "text": "The study uses endogenous tissue absorption, with strong vascular contrast from hemoglobin. It does not rely on an injected contrast agent."
          },
          {
            "label": "Illumination and reception",
            "text": "Incident fluence was below 10 mJ/cm², with an estimated skin temperature rise below 20 mK. The detector had 88% bandwidth at −6 dB and a cylindrical focal diameter of about 1 mm."
          },
          {
            "label": "Reference measurements",
            "text": "A tissue-equivalent phantom supplied the line-spread function for resolution assessment. Post-imaging photographs and cortical histology checked anatomical localization."
          }
        ],
        "takeaway": "The 1 mm focus sets the out-of-plane scale. The reported 0.2 mm resolution concerns the imaging plane.",
        "sourceNote": "Original pp. 803–806. The main text does not report animal sample size or phantom composition.",
        "sourcePage": 3
      },
      {
        "id": "reconstruction",
        "section": "METHOD / RECONSTRUCTION",
        "layout": "text",
        "title": "How waveforms become an image",
        "lead": "The detector records electrical waveforms representing the received acoustic signals at known positions. The image grid supplies candidate source locations; reconstruction estimates absorption at each location.",
        "flow": [
          {
            "label": "Set the grid",
            "text": "Choose the field of view and the candidate pixel coordinates."
          },
          {
            "label": "Predict arrival",
            "text": "Use each pixel’s distance to the detector and the assumed sound speed."
          },
          {
            "label": "Read the waveform",
            "text": "At that arrival time, sample the time derivative with the weighting in Eq. 1."
          },
          {
            "label": "Combine angles",
            "text": "Sum contributions over the circular scan, then repeat for every pixel."
          }
        ],
        "relation": "Arrival time = source-to-detector distance ÷ sound speed",
        "takeaway": "The wave travels one way from its source to the detector. The grid coordinates are chosen in advance; the measured data determine the value assigned to each pixel.",
        "sourceNote": "Original pp. 803–804, Eq. 1. Learning notes pp. 29–37 and 80–91.",
        "sourcePage": 2
      },
      {
        "id": "structural-imaging",
        "section": "INNOVATION 01 / STRUCTURAL IMAGING",
        "layout": "wide",
        "title": "Imaging through skin and skull",
        "lead": "The integrated system locates superficial brain structures without an open cranial window.",
        "points": [
          {
            "label": "What changed",
            "text": "The system combines broad optical excitation with full-view ultrasound detection and reconstruction, preserving absorption contrast while improving localization."
          },
          {
            "label": "Evidence in the image",
            "text": "Vascular branches and gross structures correspond between the PAT image and the post-imaging photograph."
          }
        ],
        "metrics": [
          {
            "value": "2.3–7.9",
            "label": "Vessel-to-parenchyma absorption contrast"
          }
        ],
        "figureIds": [
          "fig-2"
        ],
        "takeaway": "This demonstrates structural access in the rat preparation. Optical fluence and acoustic bandwidth still affect what the image can reveal.",
        "sourceNote": "Original p. 804, Fig. 2. Learning notes pp. 37–43.",
        "sourcePage": 2
      },
      {
        "id": "lesion",
        "section": "RESULT / LESION LOCALIZATION",
        "layout": "wide",
        "title": "Locating a cortical lesion",
        "lead": "After testing normal structure, the researchers asked whether an abnormal absorbing region could also be localized.",
        "paragraphs": [
          "The PAT image places the superficial lesion in the right cortex. The subsequent photograph provides an anatomical check of its position and shape."
        ],
        "metrics": [
          {
            "value": "1 × 4 mm",
            "label": "Approximate lesion dimensions"
          },
          {
            "value": "1.7–5.2",
            "label": "Lesion-to-background absorption contrast"
          }
        ],
        "figureIds": [
          "fig-3"
        ],
        "takeaway": "A needle created the lesion through the skin and skull. The imaging readout required no open window, but lesion induction was invasive. This experiment does not establish disease-specific diagnosis.",
        "sourceNote": "Original pp. 804–805, Fig. 3 and Methods. Learning notes pp. 43–45.",
        "sourcePage": 3
      },
      {
        "id": "functional-mapping",
        "section": "INNOVATION 02 / FUNCTIONAL MAPPING",
        "layout": "wide",
        "title": "Isolating the response to stimulation",
        "lead": "A static vessel map cannot show which vessels changed during a stimulus. The researchers subtract the resting image from each stimulated image.",
        "points": [
          {
            "label": "Experimental comparison",
            "text": "Left and right whiskers receive separate 10 Hz stimulation. Each resulting PAT image is compared with the unstimulated condition."
          },
          {
            "label": "Evidence in the maps",
            "text": "Responses switch hemispheres with stimulus side and follow the vascular pattern, supporting a stimulus-related hemodynamic interpretation."
          }
        ],
        "figureIds": [
          "fig-4b",
          "fig-4c"
        ],
        "relation": "Functional map = stimulated PAT image − resting PAT image",
        "sourceNote": "Original pp. 804–806, Fig. 4b–c. The 10 Hz value describes whisker stimulation.",
        "sourcePage": 3
      },
      {
        "id": "functional-validation",
        "section": "RESULT / FUNCTIONAL INTERPRETATION",
        "layout": "split",
        "title": "What the functional signal represents",
        "lead": "The signal reports a change in optical absorption associated with blood dynamics.",
        "points": [
          {
            "label": "Why blood volume matters",
            "text": "At 532 nm, oxyhemoglobin and deoxyhemoglobin have similar extinction coefficients. The authors associate the increased signal mainly with increased vascular blood volume or flow."
          },
          {
            "label": "Anatomical validation",
            "text": "The marked regions and layer IV barrel cortex histology support the location of the response. Vascular responses extend beyond the barrel cortex because changes spread along vessels."
          }
        ],
        "metrics": [
          {
            "value": "Up to 8%",
            "label": "Relative absorption change in large vessels"
          }
        ],
        "figureIds": [
          "fig-4de"
        ],
        "takeaway": "The reported change does not directly measure neuronal firing, absolute flow velocity or oxygen saturation.",
        "sourceNote": "Original pp. 804–806, Fig. 4d–e. Learning notes pp. 53–59.",
        "sourcePage": 3
      },
      {
        "id": "resolution",
        "section": "READING THE EVIDENCE",
        "layout": "text",
        "title": "Pixel spacing and spatial resolution",
        "lead": "A finely sampled image can still contain blurred structures. The image grid and the instrument answer different questions.",
        "metrics": [
          {
            "value": "40 μm",
            "label": "Pixel spacing in Fig. 2, calculated from 40 mm / 1,000"
          },
          {
            "value": "≈200 μm",
            "label": "Measured in-plane resolution"
          },
          {
            "value": "40–360 μm",
            "label": "Visible vessel diameters measured in the reference photograph"
          }
        ],
        "points": [
          {
            "label": "How the resolution was assessed",
            "text": "The authors used the line-spread function of a tissue-equivalent phantom. A narrow target spreads out in the reconstructed image, revealing the system’s spatial blur."
          },
          {
            "label": "How to interpret a small vessel",
            "text": "A high-contrast vessel smaller than the resolution can remain detectable while appearing wider than its true diameter. Detection alone does not establish accurate sizing."
          }
        ],
        "takeaway": "The four-page main article does not provide the calibration curve, target dimensions or an explicit FWHM calculation for the resolution estimate.",
        "sourceNote": "Original p. 804. Learning notes pp. 40–43 and 92–101.",
        "sourcePage": 2
      },
      {
        "id": "speed-and-limits",
        "section": "LIMITATIONS & FUTURE DIRECTIONS",
        "layout": "text",
        "title": "The cost of a circular scan",
        "lead": "A single detector acquires the angular views sequentially. Functional measurements therefore depend on stable positioning and repeatable responses.",
        "flow": [
          {
            "label": "240 positions",
            "text": "A full 360° view with 1.5° angular steps."
          },
          {
            "label": "About 4 s each",
            "text": "Signal collection and averaging at each position."
          },
          {
            "label": "About 16 min",
            "text": "The acquisition time reported for one image."
          }
        ],
        "points": [],
        "sourceNote": "Original p. 805, Discussion. 240 × 4 s = 960 s, consistent with the reported estimate.",
        "sourcePage": 3,
        "paragraphs": [
          "At each position, whisker stimulation lasts 4.5 s. Signals are collected from 0.5 to 4.5 s after stimulus onset."
        ],
        "takeaway": "The authors propose arrays and faster lasers for parallel, faster acquisition. They also propose multiple wavelengths for oxygenation-sensitive imaging beyond the single-wavelength demonstration."
      },
      {
        "id": "conclusions",
        "section": "CONCLUSIONS",
        "layout": "text",
        "title": "What this paper established",
        "lead": "The contribution is an integrated in vivo demonstration of structural and functional brain PAT through the skin and skull.",
        "points": [
          {
            "label": "Structural evidence",
            "text": "Normal anatomy and an induced superficial lesion appear with intrinsic absorption contrast and agree with post-imaging photographs."
          },
          {
            "label": "Functional evidence",
            "text": "Stimulus-versus-rest comparisons reveal lateralized vascular changes. Anatomy and histology support their spatial interpretation."
          },
          {
            "label": "Technical significance",
            "text": "Broad optical excitation, full-view acoustic acquisition and reconstruction connect optical absorption to a spatial map. The work establishes a path toward functional PACT."
          },
          {
            "label": "Scope of the conclusion",
            "text": "The demonstrated system is slow, uses one wavelength and measures a hemodynamic proxy. Real-time imaging and human brain imaging remain future directions in this paper."
          }
        ],
        "takeaway": "Gas-challenge responses and deep-brain images are reported separately in Supplementary Figs. 1–2. The four-page article does not include those figures or a quantitative deep-imaging assessment.",
        "sourceNote": "Original pp. 803–806. Learning notes pp. 65–79, 102.",
        "sourcePage": 3
      },
      {
        "id": "sources",
        "section": "SOURCES & DOWNLOADS",
        "layout": "references",
        "title": "Original files and references",
        "lead": "Original article · 4 pages. Complete learning notes · 102 pages.",
        "paragraphs": [],
        "sourceNote": "Scientific interpretation: supplied article and learning notes. Team context: official institutional pages."
      }
    ]
  }
}
---
