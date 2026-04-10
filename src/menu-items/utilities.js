// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill ,IconKey } from '@tabler/icons';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconKey
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'mas',
  title: 'Masters',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'User Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/users/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/users/update',
          breadcrumbs: false,
          
        }
      ]
    },
  /*   {
      id: 'acc',
      title: 'Access Control',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/access-control/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/access-control/update',
          breadcrumbs: false,
          
        }
      ]
    }, */
    {
      id: 'ministry',
      title: 'Ministry',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/ministry/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/ministry/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'role',
      title: 'Role Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/role/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/role/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'state',
      title: 'State Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/state/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/state/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'district',
      title: 'District Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/district/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/district/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'sub-district',
      title: 'Sub District Master',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/sub-district/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/sub-district/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'gram-panchayat',
      title: 'Gram Panchayat',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/gram-panchayat/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/gram-panchayat/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'village',
      title: 'Village',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/village/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/village/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'habitation',
      title: 'Habitation',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/habitation/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/habitation/update',
          breadcrumbs: false,
          
        }
      ]
    },
    {
      id: 'registration',
      title: 'Registration',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'add',
          title: 'Add',
          type: 'item',
          url: '/masters/registration/add',
          breadcrumbs: false,
          
        },
        {
          id: 'update',
          title: 'Update',
          type: 'item',
          //external: true,
          //target: '_blank',
          url: '/masters/registration/update',
          breadcrumbs: false,
          
        }
        
      ]
    }
  ]
};

export default utilities;
